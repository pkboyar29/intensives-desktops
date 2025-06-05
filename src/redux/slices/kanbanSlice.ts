import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IColumn, IColumnWithTasksIds } from '../../ts/interfaces/IColumn';
import { ITask, ITaskUpdate } from '../../ts/interfaces/ITask';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { hover } from 'framer-motion';

type TasksState = {
  byId: Record<number, ITask>;
  placeholderIndex: number | null;
};

type DndTaskType = {
  draggableId: number;
  draggableIndex: number | null;
  draggableColumnId: number | null;
  hoverId: number | null;
  hoverIndex: number | null;
  hoverColumnId: number | null;
  hoverParentTaskId: number | null;
  draggableWidth?: number;
  draggableHeight?: number;
  flaggedPlaceholder?: boolean;
  insertPosition?: 'top' | 'bottom' | null;
};

interface KanbanState {
  columns: IColumnWithTasksIds[] | null; // Колонки с taskIds
  tasks: TasksState;
  subtasks: {
    [taskId: number]: number[]; // "id задачи : массив id её подзадач"
  } | null;
  dndTaskPlaceholderIndex: DndTaskType | null;
  previousState: KanbanState | null;
}

const initialState: KanbanState = {
  columns: null,
  tasks: { byId: {}, placeholderIndex: null },
  subtasks: {},
  dndTaskPlaceholderIndex: null,
  previousState: null,
};

const EMPTY_ARRAY: number[] = []; //dsl

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    setColumns(state, action: PayloadAction<IColumn[]>) {
      //можно сделать безопасным — сохранять старые taskIds, если уже есть
      state.columns = action.payload
        .map((column) => ({
          ...column,
          taskIds: EMPTY_ARRAY, // Инициализируем изначально пустой массив задач колонки
        }))
        .sort((a, b) => a.position - b.position); // Сортируем колонки по позиции

      //state.columns = newColumns;
    },
    addColumn(state, action: PayloadAction<IColumn>) {
      const newColumn = {
        ...action.payload,
        taskIds: EMPTY_ARRAY, // Инициализируем пустой массив для задач
      };

      if (state.columns) {
        state.columns.push(newColumn); // Добавляем новую колонку
      } else {
        state.columns = [newColumn]; // Если колонок не было, создаём массив
      }
    },
    deleteColumn(state, action: PayloadAction<number>) {
      if (state.columns) {
        state.columns = state.columns.filter(
          (column) => column.id !== action.payload
        );
      }
    },
    moveColumnTemporary(
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) {
      if (!state.columns) return;

      const { dragIndex, hoverIndex } = action.payload;

      // Перемещаем колонку временно (только для UI)
      const columnsCopy = [...state.columns];
      const [movedColumn] = columnsCopy.splice(dragIndex, 1);
      columnsCopy.splice(hoverIndex, 0, movedColumn);

      state.columns = columnsCopy;
    },
    moveColumn(
      state,
      action: PayloadAction<{ columnId: number; newPosition: number }>
    ) {
      if (state.columns) {
        const { columnId, newPosition } = action.payload;

        // Найти текущую колонку
        const currentColumn = state.columns.find((col) => col.id === columnId);
        if (!currentColumn) return;

        const currentPosition = currentColumn.position;

        if (newPosition > currentPosition) {
          // Перемещение вправо
          state.columns.forEach((column) => {
            if (
              column.position > currentPosition &&
              column.position <= newPosition
            ) {
              column.position -= 1; // Сдвигаем на 1 влево
            }
          });
        } else if (newPosition < currentPosition) {
          // Перемещение влево
          state.columns.forEach((column) => {
            if (
              column.position < currentPosition &&
              column.position >= newPosition
            ) {
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
    renameColumn(
      state,
      action: PayloadAction<{ columnId: number; newName: string }>
    ) {
      if (state.columns) {
        const { columnId, newName } = action.payload;

        // Найти текущую колонку
        const currentColumn = state.columns.find((col) => col.id === columnId);
        if (!currentColumn) return;

        currentColumn.name = newName;
      }
    },
    changeColumnColor(
      state,
      action: PayloadAction<{ columnId: number; newColorHEX: string }>
    ) {
      if (state.columns) {
        const { columnId, newColorHEX } = action.payload;

        // Найти текущую колонку
        const currentColumn = state.columns.find((col) => col.id === columnId);
        if (!currentColumn) return;

        currentColumn.colorHEX = newColorHEX;
      }
    },
    setColumnTasks(
      state,
      action: PayloadAction<{ columnId: number; tasks: ITask[] }>
    ) {
      const { columnId, tasks } = action.payload;

      if (!state.columns || !state.tasks) return;

      // Добавляем или обновляем задачи в tasks
      tasks.forEach((task) => {
        state.tasks.byId[task.id] = task;
      });

      // Обновляем список taskIds для данной колонки
      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        // Просто добавляем новые задачи в конец списка taskIds
        column.taskIds = [
          ...column.taskIds,
          ...tasks
            .filter((task) => !task.parentTask) // Только задачи без parent_task
            .map((task) => task.id),
        ] // Сохраняем только ID задач
          .sort(
            (a, b) =>
              state.tasks.byId[a].position - state.tasks.byId[b].position
          ); // Сортируем по позиции
      }
    },
    setSubtasks(
      state,
      action: PayloadAction<{ parentTaskId: number; subtasks: ITask[] }>
    ) {
      const { parentTaskId, subtasks } = action.payload;

      if (!state.tasks || !state.subtasks) return;

      subtasks.forEach((subtask) => {
        state.tasks.byId[subtask.id] = subtask;
      });

      state.subtasks[parentTaskId] = subtasks.map((subtask) => subtask.id);

      // Заnullяем поле так как теперь работаем с массивом subtasks
      if (state.tasks.byId[parentTaskId]) {
        state.tasks.byId[parentTaskId] = {
          ...state.tasks.byId[parentTaskId],
          initialSubtaskCount: null, // Явно изменяем значение
        };
      }
    },
    addTask(state, action: PayloadAction<{ columnId: number; task: ITask }>) {
      const { columnId, task } = action.payload;

      if (!state.columns || !state.tasks) return;

      // Добавляем задачу в tasks
      state.tasks.byId[task.id] = task;

      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        // +1 к количеству задач у колонки
        column.tasksCount = column.tasksCount + 1;

        // Обновляем позиции всех задач в колонке
        column.taskIds.forEach((id, index) => {
          const taskToUpdate = state.tasks.byId[id];
          taskToUpdate.position = index + 1; // Новая позиция (с 1)
        });

        // Добавляем ID задачи в taskIds
        column.taskIds.push(task.id);

        // Сортируем taskIds по позиции задачи
        column.taskIds.sort((a, b) => {
          const taskA = state.tasks.byId[a];
          const taskB = state.tasks.byId[b];
          return taskA.position - taskB.position; // Сортировка по возрастанию позиции
        });
      }
    },
    updateTask(state, action: PayloadAction<ITaskUpdate>) {
      const { id, ...rest } = action.payload;

      if (!state.columns || !state.tasks || !state.subtasks) return;

      // Находим задачу по её ID
      const taskToUpdate = state.tasks.byId[id];
      if (!taskToUpdate) return; // Если задача не найдена, ничего не делаем

      Object.assign(taskToUpdate, rest); // обновляем только измененные поля
    },
    deleteTask(state, action: PayloadAction<number>) {
      const taskId = action.payload;

      if (!state.columns || !state.tasks || !state.subtasks) return;

      // Находим задачу по её ID
      const taskToRemove = state.tasks.byId[taskId];
      if (!taskToRemove) return; // Если задача не найдена, ничего не делаем

      if (taskToRemove.parentTask) {
        // Удаляем подзадачу из массива subtasks родительской задачи
        const parentTaskId = taskToRemove.parentTask;
        state.subtasks[parentTaskId] = state.subtasks[parentTaskId].filter(
          (id) => id !== taskId
        );

        // Если массив подзадач стал пустым, можно удалить запись (опционально)
        if (state.subtasks[parentTaskId].length === 0) {
          delete state.subtasks[parentTaskId];
        }
      } else {
        // Иначе удаляем задачу из колонки
        // Получаем колонку, к которой относится задача
        const column = state.columns.find(
          (col) => col.id === taskToRemove.column
        );

        if (column) {
          // -1 к количеству задач у колонки
          column.tasksCount = column.tasksCount - 1;

          // Удаляем ID задачи из списка taskIds этой колонки
          column.taskIds = column.taskIds.filter((id) => id !== taskId);
        }
      }

      // Удаляем задачу из общего списка задач
      delete state.tasks.byId[taskId];
    },
    addSubtask(
      state,
      action: PayloadAction<{ parentTaskId: number; subtask: ITask }>
    ) {
      const { parentTaskId, subtask } = action.payload;

      if (!state.tasks || !state.subtasks) return;

      // Добавляем подзадачу в tasks
      state.tasks.byId[subtask.id] = subtask;

      // Если у родительской задачи ещё нет подзадач
      if (!state.subtasks![parentTaskId]) {
        state.subtasks![parentTaskId] = []; // инициализируем массив подзадач
      }

      // Добавляем ID подзадачи в массив подзадач
      state.subtasks![parentTaskId].push(subtask.id);

      // Заnullяем поле так как теперь работаем с массивом subtasks
      if (state.tasks.byId[parentTaskId]) {
        state.tasks.byId[parentTaskId] = {
          ...state.tasks.byId[parentTaskId],
          initialSubtaskCount: null, // Явно изменяем значение
        };
      }
    },
    moveTaskTemporary(
      state,
      action: PayloadAction<{
        taskId: number;
        dragIndex: number;
        hoverIndex: number;
        fromColumnId: number | null;
        fromParentTaskId: number | null;
        toColumnId: number | null;
        toParentTaskId: number | null;
        insertPosition?: 'top' | 'bottom' | null;
      }>
    ) {
      var {
        taskId,
        dragIndex,
        hoverIndex,
        fromColumnId,
        fromParentTaskId,
        toColumnId,
        toParentTaskId,
        insertPosition,
      } = action.payload;

      /*
      console.log(insertPosition);
      // Пересчеты позиции с учетом вставки снизу или сверху
      if (dragIndex === hoverIndex && insertPosition === 'bottom') {
        hoverIndex = hoverIndex + 1;
      }

      if (hoverIndex > dragIndex && insertPosition === 'bottom') {
        hoverIndex = hoverIndex + 1;
      }

      if (dragIndex < hoverIndex && insertPosition === 'top') {
        hoverIndex = hoverIndex - 1;
      }
      */

      if (fromColumnId !== toColumnId && !fromParentTaskId && !toParentTaskId) {
        // Задача перемещается между колонками
        const fromColumn = state.columns?.find(
          (col) => col.id === fromColumnId
        );
        const toColumn = state.columns?.find((col) => col.id === toColumnId);

        if (!fromColumn || !toColumn || !state.columns) return;

        // Проверяем границы индексов
        if (
          dragIndex < 0 ||
          dragIndex >= fromColumn.taskIds.length ||
          hoverIndex < 0 ||
          hoverIndex > toColumn.taskIds.length
        ) {
          console.warn('Индексы задач выходят за пределы массива');
          return;
        }

        // Перемещаем задачу из одной колонки в другую
        const fromColumnTasks = [...fromColumn.taskIds];
        const [movedTask] = fromColumnTasks.splice(dragIndex, 1);

        const toColumnTasks = [...toColumn.taskIds];
        toColumnTasks.splice(hoverIndex, 0, movedTask);

        // Обновляем позиции в колонках
        state.columns = state.columns?.map((col) => {
          if (col.id === fromColumnId) {
            return { ...col, taskIds: fromColumnTasks };
          } else if (col.id === toColumnId) {
            return { ...col, taskIds: toColumnTasks };
          }
          return col;
        });
      } else if (
        fromColumnId === toColumnId &&
        !fromParentTaskId &&
        !toParentTaskId
      ) {
        // Задача перемещается внутри одной колонки
        const column = state.columns?.find((col) => col.id === fromColumnId);
        if (!column || !state.columns) return;

        // Проверяем границы индексов
        if (
          dragIndex < 0 ||
          dragIndex >= column.taskIds.length ||
          hoverIndex < 0 ||
          hoverIndex >= column.taskIds.length
        ) {
          console.warn('Индексы задач выходят за пределы массива');
          return;
        }

        // Перемещаем задачу внутри этой колонки
        const tasksCopy = [...column.taskIds];
        const [movedTask] = tasksCopy.splice(dragIndex, 1);
        tasksCopy.splice(hoverIndex, 0, movedTask);

        state.columns = state.columns?.map((col) =>
          col.id === fromColumnId ? { ...col, taskIds: tasksCopy } : col
        );
      } else if (!fromParentTaskId && toParentTaskId) {
        // Задача из колонки перемещается в подзадачи
        const fromColumn = state.columns?.find(
          (col) => col.id === fromColumnId
        );

        if (
          !state.columns ||
          !state.subtasks ||
          !fromColumn ||
          !toParentTaskId ||
          !state.subtasks[toParentTaskId]
        )
          return;

        const subtasks = state.subtasks[toParentTaskId];

        // Проверяем границы индексов
        if (
          dragIndex < 0 ||
          dragIndex >= fromColumn.taskIds.length ||
          hoverIndex < 0 ||
          hoverIndex > subtasks.length
        ) {
          // Здесь допускаем hoverIndex === subtasks.length для добавления в конец
          console.warn('Индексы задач выходят за пределы массива');
          return;
        }

        // Удаляем задачу из колонки
        const fromColumnTasks = [...fromColumn.taskIds];
        const [movedTask] = fromColumnTasks.splice(dragIndex, 1);

        // Добавляем задачу в подзадачи
        const subtasksCopy = [...subtasks];
        subtasksCopy.splice(hoverIndex, 0, movedTask);

        // Обновляем состояния
        // 1. Обновляем колонку
        state.columns = state.columns.map((col) =>
          col.id === fromColumnId ? { ...col, taskIds: fromColumnTasks } : col
        );

        // 2. Обновляем подзадачи
        state.subtasks[toParentTaskId] = subtasksCopy;
      } else if (fromParentTaskId && !toParentTaskId) {
        // Подзадача перемещается в колонку
        const toColumn = state.columns?.find((col) => col.id === toColumnId);

        if (
          !state.columns ||
          !state.subtasks ||
          !toColumn ||
          !fromParentTaskId ||
          !state.subtasks[fromParentTaskId]
        )
          return;

        const subtasks = state.subtasks[fromParentTaskId];

        // Проверяем границы индексов
        if (
          dragIndex < 0 ||
          dragIndex >= subtasks.length ||
          hoverIndex < 0 ||
          hoverIndex > toColumn.taskIds.length
        ) {
          // Здесь допускаем hoverIndex === subtasks.length для добавления в конец
          console.warn('Индексы задач выходят за пределы массива');
          return;
        }

        // Удаляем задачу из подзадач
        const subtasksCopy = [...subtasks];
        const [movedSubtask] = subtasksCopy.splice(dragIndex, 1);

        // Добавляем задачу в колонку
        const toColumnTasks = [...toColumn.taskIds];
        toColumnTasks.splice(hoverIndex, 0, movedSubtask);

        // Обновляем состояния
        // 1.Обновляем подзадачи
        state.subtasks[fromParentTaskId] = subtasksCopy;

        // 2. Обновляем колонку
        state.columns = state.columns.map((col) =>
          col.id === toColumnId ? { ...col, taskIds: toColumnTasks } : col
        );
      } else if (fromParentTaskId === toParentTaskId) {
        // Подзадача перемещается внутри одной задачи
        if (
          !state.subtasks ||
          !fromParentTaskId ||
          !state.subtasks[fromParentTaskId]
        )
          return;

        const subtasks = state.subtasks[fromParentTaskId];

        // Проверяем границы индексов
        if (
          dragIndex < 0 ||
          dragIndex >= subtasks.length ||
          hoverIndex < 0 ||
          hoverIndex >= subtasks.length
        ) {
          console.warn('Индексы подзадач выходят за пределы массива');
          return;
        }

        const subtasksCopy = [...subtasks];
        const [movedSubtask] = subtasksCopy.splice(dragIndex, 1);
        subtasksCopy.splice(hoverIndex, 0, movedSubtask);

        // Обновляем массив подзадач для родительской задачи
        state.subtasks[fromParentTaskId] = subtasksCopy;
      } else if (fromParentTaskId !== toParentTaskId) {
        // Подзадача перемещается между разными задачами
        if (
          !state.subtasks ||
          !fromParentTaskId ||
          !state.subtasks[fromParentTaskId] ||
          !toParentTaskId ||
          !state.subtasks[toParentTaskId]
        )
          return;

        const fromSubtasks = state.subtasks[fromParentTaskId];
        const toSubtasks = state.subtasks[toParentTaskId];

        // Проверяем границы индексов
        if (
          dragIndex < 0 ||
          dragIndex >= fromSubtasks.length ||
          hoverIndex < 0 ||
          hoverIndex > toSubtasks.length
        ) {
          console.warn('Индексы подзадач выходят за пределы массива');
          return;
        }

        // Удаляем подзадачу из изначальной задачи
        const [movedSubtask] = fromSubtasks.splice(dragIndex, 1);

        // Добавляем задачу в другую задачу
        toSubtasks.splice(hoverIndex, 0, movedSubtask);

        // Обновляем состояния
        state.subtasks[fromParentTaskId] = [...fromSubtasks];
        state.subtasks[toParentTaskId] = [...toSubtasks];
      }
    },
    setMovingPlaceholder(
      state,
      action: PayloadAction<{
        draggableId: number | null;
        draggableIndex?: number | null;
        draggableColumnId?: number | null;
        hoverId?: number | null;
        hoverIndex?: number | null;
        hoverColumnId?: number | null;
        hoverParentTaskId?: number | null;
        draggableWidth?: number;
        draggableHeight?: number;
        flaggedPlaceholder?: boolean;
        insertPosition?: 'top' | 'bottom' | null;
      }>
    ) {
      //state.tasks.byId[action.payload.hoverId].isDndPlaceholder = true;
      //state.tasks.placeholderIndex = action.payload.hoverId;
      const {
        draggableId,
        draggableIndex,
        draggableColumnId,
        hoverId,
        hoverIndex,
        hoverColumnId,
        hoverParentTaskId,
        draggableWidth,
        draggableHeight,
        flaggedPlaceholder,
        insertPosition,
      } = action.payload;

      if (draggableId === null) state.dndTaskPlaceholderIndex = null;

      state.dndTaskPlaceholderIndex = {
        hoverId: hoverId ? hoverId : null,
        draggableId: draggableId
          ? draggableId
          : state.dndTaskPlaceholderIndex?.draggableId!,
        draggableIndex: draggableIndex ? draggableIndex : null,
        draggableColumnId: draggableColumnId ? draggableColumnId : null,
        hoverIndex: hoverIndex ? hoverIndex : null,
        hoverColumnId: hoverColumnId ? hoverColumnId : null,
        hoverParentTaskId: hoverParentTaskId ? hoverParentTaskId : null,
        draggableWidth: draggableWidth,
        draggableHeight: draggableHeight,
        flaggedPlaceholder: flaggedPlaceholder,
        insertPosition: insertPosition,
      };
    },
    savePreviousState(state) {
      state.previousState = JSON.parse(JSON.stringify(state)); // Глубокая копия текущего состояния
    },
    restoreKanbanState(state) {
      //state.columns = action.payload.columns;
      //state.tasks = action.payload.tasks;
      //state.subtasks = action.payload.subtasks;
      if (state.previousState) {
        return state.previousState; // Восстанавливаем предыдущее состояние
      }
      return state;
    },
  },
});

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
  updateTask,
  deleteTask,
  addSubtask,
  moveTaskTemporary,
  setMovingPlaceholder,
  savePreviousState,
  restoreKanbanState,
} = kanbanSlice.actions;

export default kanbanSlice.reducer;

export const selectColumnById = (id: number) =>
  createSelector(
    (state: RootState) => state.kanban.columns,
    (columns) => columns?.find((col) => col.id === id)
  );

export const selectTasksByColumnId = (id: number) =>
  createSelector(
    [(state: RootState) => state.kanban.tasks, selectColumnById(id)],
    (tasks, column) => column?.taskIds.map((taskId) => tasks.byId[taskId])
  );

export const makeSelectTasksDataByColumnId = (id: number) =>
  createSelector(
    [(state: RootState) => state.kanban.tasks, selectColumnById(id)],
    (tasksData, column) => {
      const tasks: ITask[] =
        column?.taskIds
          .map((taskId) => tasksData.byId[taskId])
          .filter((t): t is ITask => t !== undefined) ?? [];

      return {
        tasks,
        placeholderIndex: tasksData.placeholderIndex ?? null,
      };
    }
  );

// Селектор для получения ID подзадач
export const selectSubtaskIds = (state: RootState, id: number) =>
  state.kanban.subtasks?.[id] ?? EMPTY_ARRAY;

// Мемоизированный селектор для получения данных подзадач
/*
export const selectSubtaskData = createSelector(
  [selectSubtaskIds, (state: RootState) => state.kanban.tasks],
  (subtaskIds, tasks) =>
    subtaskIds.map((subtaskId) => tasks?.[subtaskId]).filter(Boolean)
);
*/

export const makeSelectSubtaskData = (taskId: number) =>
  createSelector(
    [
      (state: RootState) => state.kanban.subtasks?.[taskId] ?? EMPTY_ARRAY,
      (state: RootState) => state.kanban.tasks ?? {},
    ],
    (subtasksIds, tasks) =>
      subtasksIds.map((id) => tasks.byId[id]).filter(Boolean)
  );
