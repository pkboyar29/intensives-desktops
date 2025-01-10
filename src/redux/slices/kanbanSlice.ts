import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IColumn, IColumnWithTasksIds } from '../../ts/interfaces/IColumn';
import { ITask } from '../../ts/interfaces/ITask';

interface KanbanState {
    columns: IColumnWithTasksIds[] | null; // Колонки с taskIds
    tasks: {
        [taskId: number]: ITask; // Все задачи (включая подзадачи). "id задачи : сама задача"
    } | null;
    subtasks: {
        [taskId: number]: number[]; // "id задачи : массив id её подзадач"
    } | null
}

const initialState: KanbanState = {
    columns: null,
    tasks: {},
    subtasks: {}
}

const kanbanSlice = createSlice({
    name: "kanban",
    initialState,
    reducers:{
        setColumns(state, action: PayloadAction<IColumn[]>) {
            state.columns = action.payload.map((column) => ({
                ...column,
                taskIds: [], // Инициализируем изначально пустой массив задач колонки
            }))
            .sort((a, b) => a.position - b.position); // Сортируем колонки по позиции
        },
        addColumn(state, action: PayloadAction<IColumn>) {
            const newColumn = {
                ...action.payload,
                taskIds: [], // Инициализируем пустой массив для задач
            };

            if(state.columns) {
                state.columns.push(newColumn); // Добавляем новую колонку
            } else {
                state.columns = [newColumn]; // Если колонок не было, создаём массив
            }
        },
        deleteColumn(state, action: PayloadAction<number>) {
            if(state.columns) {
                state.columns = state.columns.filter((column) => column.id !== action.payload);
            }
        },
        moveColumnTemporary(state, action: PayloadAction<{ dragIndex: number; hoverIndex: number }>) {
            if (!state.columns) return;
          
            const { dragIndex, hoverIndex } = action.payload;
          
            // Перемещаем колонку временно (только для UI)
            const columnsCopy = [...state.columns];
            const [movedColumn] = columnsCopy.splice(dragIndex, 1);
            columnsCopy.splice(hoverIndex, 0, movedColumn);
          
            state.columns = columnsCopy;
        },
        moveColumn(state, action: PayloadAction<{columnId: number; newPosition: number}>) {
            if(state.columns) {
                const { columnId, newPosition } = action.payload;

                // Найти текущую колонку
                const currentColumn = state.columns.find((col) => col.id === columnId);
                if (!currentColumn) return;

                const currentPosition = currentColumn.position;

                if (newPosition > currentPosition) {
                    // Перемещение вправо
                    state.columns.forEach((column) => {
                        if (column.position > currentPosition && column.position <= newPosition) {
                            column.position -= 1; // Сдвигаем на 1 влево
                        }
                    });
                } else if (newPosition < currentPosition) {
                    // Перемещение влево
                    state.columns.forEach((column) => {
                        if (column.position < currentPosition && column.position >= newPosition) {
                            column.position += 1; // Сдвигаем на 1 вправо
                        }
                    });
                }

                // Устанавливаем новую позицию для перемещаемой колонки
                currentColumn.position = newPosition;

                // Сортируем массив колонок по позиции, чтобы они оставались упорядоченными
                state.columns.sort((a, b) => a.position - b.position);
            }
        },
        renameColumn(state, action: PayloadAction<{columnId: number; newName: string}>) {
            if(state.columns) {
                const { columnId, newName } = action.payload;

                // Найти текущую колонку
                const currentColumn = state.columns.find((col) => col.id === columnId);
                if (!currentColumn) return;

                currentColumn.name = newName;
            }
        },
        changeColumnColor(state, action: PayloadAction<{columnId: number, newColorHEX: string}>) {
            if(state.columns) {
                const { columnId, newColorHEX } = action.payload;

                // Найти текущую колонку
                const currentColumn = state.columns.find((col) => col.id === columnId);
                if (!currentColumn) return;

                currentColumn.colorHEX = newColorHEX;
            }
        },
        setColumnTasks(state, action: PayloadAction<{ columnId: number; tasks: ITask[] }>) {
            const { columnId, tasks } = action.payload;

            if (!state.columns) return;

            // Добавляем или обновляем задачи в tasks
            tasks.forEach((task) => {
                state.tasks![task.id] = task;
            });
            
            // Обновляем список taskIds для данной колонки
            const column = state.columns.find((col) => col.id === columnId);
            if (column) {
                // Просто добавляем новые задачи в конец списка taskIds
                column.taskIds = [...column.taskIds, ...tasks
                    .filter((task) => !task.parentTask) // Только задачи без parent_task
                    .map((task) => task.id)] // Сохраняем только ID задач
                    .sort((a, b) => state.tasks![a].position - state.tasks![b].position); // Сортируем по позиции
            }
        },
        setSubtasks(state, action: PayloadAction<{ parentTaskId: number, subtasks: ITask[] }>) {
            const { parentTaskId, subtasks } = action.payload;

            if (!state.tasks || !state.subtasks) return;

            subtasks.forEach((subtask) => {
                state.tasks![subtask.id] = subtask;
            });

            // Если у родительской задачи ещё нет подзадач, инициализируем массив
            //if (!state.subtasks[parentTaskId]) {
            //    state.subtasks[parentTaskId] = [];
            //}
            
            state.subtasks[parentTaskId] = subtasks.map((subtask) => subtask.id);
        },
        addTask(state, action: PayloadAction<{ columnId: number; task: ITask }>) {
            const { columnId, task } = action.payload;

            if (!state.columns || !state.tasks) return;

            // Добавляем задачу в tasks
            state.tasks![task.id] = task;

            const column = state.columns.find((col) => col.id === columnId);
            if (column) {
                // +1 к количеству задач у колонки
                column.tasksCount = column.tasksCount + 1;

                // Обновляем позиции всех задач в колонке
                column.taskIds.forEach((id, index) => {
                    const taskToUpdate = state.tasks![id];
                    taskToUpdate.position = index + 1; // Новая позиция (с 1)
                });

                // Добавляем ID задачи в taskIds
                column.taskIds.push(task.id);
                
                // Сортируем taskIds по позиции задачи
                column.taskIds.sort((a, b) => {
                    const taskA = state.tasks![a];
                    const taskB = state.tasks![b];
                    return taskA.position - taskB.position; // Сортировка по возрастанию позиции
                });
            }
        },
        deleteTask(state, action: PayloadAction<number>) {
            const taskId = action.payload;

            if (!state.columns || !state.tasks) return;

            // Находим задачу по её ID
            const taskToRemove = state.tasks[taskId];
            if (!taskToRemove) return; // Если задача не найдена, ничего не делаем

             // Получаем колонку, к которой относится задача
            const column = state.columns.find((col) => col.id === taskToRemove.column);

            if (column) {
                // -1 к количеству задач у колонки
                column.tasksCount = column.tasksCount - 1;
                
                // Удаляем ID задачи из списка taskIds этой колонки
                column.taskIds = column.taskIds.filter((id) => id !== taskId);
            }
        },
        addSubtask(state, action: PayloadAction<{ parentTaskId: number, subtask: ITask}>) {
            const { parentTaskId, subtask } = action.payload;

            if (!state.tasks || !state.subtasks) return;

            // Добавляем подзадачу в tasks
            state.tasks![subtask.id] = subtask;

            // Если у родительской задачи ещё нет подзадач
            if (!state.subtasks![parentTaskId]) {
                state.subtasks![parentTaskId] = []; // инициализируем массив подзадач 
            }

            // Добавляем ID подзадачи в массив подзадач
            state.subtasks![parentTaskId].push(subtask.id);

            // Заnullяем поле так как теперь работаем с массивом subtasks
            if (state.tasks![parentTaskId]) {
                    state.tasks![parentTaskId] = {
                    ...state.tasks![parentTaskId],
                    initialSubtaskCount: null, // Явно изменяем значение
                };
            }
            console.log(parentTaskId)
            console.log(state.tasks![parentTaskId])
        },
        restoreKanbanState(state, action: PayloadAction<KanbanState>) {
            state.columns = action.payload.columns;
            state.tasks = action.payload.tasks;
            state.subtasks = action.payload.subtasks;
        }
    }
})

export const {
    setColumns,
    addColumn,
    deleteColumn,
    moveColumnTemporary,
    moveColumn,
    renameColumn,
    changeColumnColor,
    setColumnTasks,
    setSubtasks,
    addTask,
    deleteTask,
    addSubtask,
    restoreKanbanState,
 } = kanbanSlice.actions;
export default kanbanSlice.reducer;