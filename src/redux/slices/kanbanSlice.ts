import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IColumn } from '../../ts/interfaces/IColumn';
import { ITask } from '../../ts/interfaces/ITask';

interface KanbanState {
    columns: IColumn[] | null;
    tasks: ITask[] | null;
}

const initialState: KanbanState = {
    columns: null,
    tasks: null
}

const kanbanSlice = createSlice({
    name: "kanban",
    initialState,
    reducers:{
        setColumns(state, action: PayloadAction<KanbanState["columns"]>) {
            state.columns = action.payload;
        },
        addColumn(state, action: PayloadAction<IColumn>) {
            if(state.columns) {
                state.columns.push(action.payload); // Добавляем новую колонку
            } else {
                state.columns = [action.payload]; // Если колонок не было, создаём массив
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
        }
    }
})

export const { setColumns, addColumn, deleteColumn, moveColumn, renameColumn, changeColumnColor } = kanbanSlice.actions;
export default kanbanSlice.reducer;