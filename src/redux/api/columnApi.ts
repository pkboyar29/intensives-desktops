import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import { RootState } from '../store';

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
          dispatch(
            columnApi.util.updateQueryData('getColumnsTeam', arg.team, (draft) => {
              draft.push(newColumn); // Добавляем новую колонку в кеш
            })
          );
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
    }),
    updateColumnName: builder.mutation<IColumn, Partial<IColumn>>({
      query: ({ id, name }) => ({
        url: `/kanban_columns/${id}/`,
        method: 'PATCH',
        body: { name },
      }),
      transformResponse: (response: any): IColumn => mapColumn(response),
    }),
    deleteColumn: builder.mutation<void, number>({
      query: (id) => ({
        url: `/kanban_columns/${id}/`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        try{
          const state = getState() as RootState;
          const currentTeam = state.team.data;

          await queryFulfilled;

          if (!currentTeam) {
            console.error('No current team available!');
            return;
          }
          const teamId = currentTeam.index; // Получаем идентификатор команды

          dispatch(
            columnApi.util.updateQueryData('getColumnsTeam', teamId, (draft) => {
              return draft.filter((column) => column.id !== id); // Удаляем колонку из кеша
            })
          );
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
  useDeleteColumnMutation,
} = columnApi;
