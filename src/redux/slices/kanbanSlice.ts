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
                column.taskIds = tasks
                .filter((task) => !task.parentTask) // Только задачи без parent_task
                .sort((a, b) => a.position - b.position) // Сортируем задачи по позиции
                .map((task) => task.id); // Сохраняем только ID задач
            }
        },
        addTask(state, action: PayloadAction<{ columnId: number; task: ITask }>) {
            const { columnId, task } = action.payload;

            if (!state.columns || !state.tasks) return;

            // Добавляем задачу в tasks
            state.tasks![task.id] = task;

            const column = state.columns.find((col) => col.id === columnId);
            if (column) {
                
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
        }
    }
})

export const { setColumns, addColumn, deleteColumn, moveColumn, renameColumn, changeColumnColor, setColumnTasks, addTask } = kanbanSlice.actions;
export default kanbanSlice.reducer;