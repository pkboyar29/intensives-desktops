import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import { RootState } from '../store';
import { setColumns, addColumn, deleteColumn, moveColumn, renameColumn, changeColumnColor, restoreKanbanState, savePreviousState } from '../slices/kanbanSlice';
import {
  IColumn,
  IColumnCreate,
  IColumnPositionUpdate,
} from '../../ts/interfaces/IColumn';

const mapColumn = (unmappedEvent: any): IColumn => {
  return {
    id: unmappedEvent.id,
    name: unmappedEvent.name,
    colorHEX: unmappedEvent.colorHEX,
    position: unmappedEvent.position,
    team: unmappedEvent.team,
    tasksCount: unmappedEvent.tasks_count,
  };
};


export const columnApi = createApi({
  reducerPath: 'columnApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getColumnsTeam: builder.query<IColumn[], number>({
      query: (team) => `/kanban_columns/?team=${team}`,
      transformResponse: (response: any): IColumn[] =>
        response.map((unmappedColumn: any) => mapColumn(unmappedColumn)),
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try{
          const { data: columns } = await queryFulfilled;
          console.log(columns)
          dispatch(setColumns(columns));
        } catch (err) {
          console.error('Error by getting column:', err);
        }
      }
    }),
    createColumn: builder.mutation<IColumn, IColumnCreate>({
      query: (data) => ({
        url: '/kanban_columns/',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any): IColumn => mapColumn(response),
      async onQueryStarted(arg, {dispatch, queryFulfilled }) {
        try {
          const { data: newColumn } = await queryFulfilled;

          // Диспатчим addColumn для обновления состояния в slice kanban
          dispatch(addColumn(newColumn));
        } catch (err) {
          console.error('Error creating column:', err);
        }
      }
    }),
    updateColumn: builder.mutation<IColumn, IColumn>({
      query: (data) => ({
        url: `/kanban_columns/${data.id}/`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: any): IColumn => mapColumn(response),
    }),
    updateColumnPosition: builder.mutation<IColumn, IColumnPositionUpdate>({
      query: (data) => ({
        url: `/kanban_columns/${data.id}/`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: any): IColumn => mapColumn(response),
      async onQueryStarted({id, position}, { dispatch, queryFulfilled, getState }) {
        // Сохраняем предыдущее состояние
        //const previousState = (getState() as RootState).kanban;
        dispatch(savePreviousState());
        
        // Оптимистично обновляем позиции
        dispatch(moveColumn({ columnId: id, newPosition: position }));

        try{
          await queryFulfilled; // Дождаться завершения запроса
          
        } catch (err) {
          console.error("Ошибка синхронизации позиции:", err);
          // Откат к предыдущему состоянию при ошибке
          //dispatch(restoreKanbanState(previousState));
          dispatch(restoreKanbanState())
        }
      }
    }),
    updateColumnName: builder.mutation<IColumn, Partial<IColumn>>({
      query: ({ id, name }) => ({
        url: `/kanban_columns/${id}/`,
        method: 'PATCH',
        body: { name },
      }),
      transformResponse: (response: any): IColumn => mapColumn(response),
      async onQueryStarted({id, name}, { dispatch, queryFulfilled, getState }) {
        try{
          await queryFulfilled;
          if(id && name) {
            dispatch(renameColumn({ columnId: id, newName: name}));
          }
        } catch (err) {
          console.error('Error on rename column:', err);
        }
      }
    }),
    updateColumnColor: builder.mutation<IColumn, Partial<IColumn>>({
      query: ({ id, colorHEX }) => ({
        url: `/kanban_columns/${id}/`,
        method: 'PATCH',
        body: { colorHEX },
      }),
      transformResponse: (response: any): IColumn => mapColumn(response),
      async onQueryStarted({id, colorHEX}, { dispatch, queryFulfilled, getState }) {
        // Сохраняем предыдущее состояние
        //const previousState = (getState() as RootState).kanban;
        dispatch(savePreviousState());

        // Оптимистично обновляем позиции
        if(id && colorHEX) {
          dispatch(changeColumnColor({ columnId: id, newColorHEX: colorHEX}));
        }

        try{
          await queryFulfilled;

        } catch (err) {
          console.error('Error on changing color column:', err);
          // Откат к предыдущему состоянию при ошибке
          //dispatch(restoreKanbanState(previousState));
          dispatch(restoreKanbanState());
        }
      }
    }),
    deleteColumn: builder.mutation<void, number>({
      query: (id) => ({
        url: `/kanban_columns/${id}/`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        try{
          await queryFulfilled;
          
          dispatch(deleteColumn(id));
        } catch (err) {
          console.error('Error deleting column:', err);
        }
      }
    }),
  }),
});

export const {
  useLazyGetColumnsTeamQuery,
  useCreateColumnMutation,
  useUpdateColumnMutation,
  useUpdateColumnPositionMutation,
  useUpdateColumnNameMutation,
  useUpdateColumnColorMutation,
  useDeleteColumnMutation,
} = columnApi;
