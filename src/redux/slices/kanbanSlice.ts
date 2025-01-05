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
        }
    }
})

export const { setColumns, addColumn, deleteColumn } = kanbanSlice.actions;
export default kanbanSlice.reducer;