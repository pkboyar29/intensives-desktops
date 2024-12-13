import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import {
    IColumn, IColumnCreate,
    IColumnPositionUpdate
} from '../../ts/interfaces/IColumn';

const mapColumn = (unmappedEvent: any): IColumn => {
    return {
      id: unmappedEvent.id,
      name: unmappedEvent.name,
      colorHEX: unmappedEvent.colorHEX,
      position: unmappedEvent.position,
      team: unmappedEvent.team
    };
};

export const columnApi = createApi({
    reducerPath: 'columnApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getColumnsTeam: builder.query<IColumn[], number>({
            query: (team) => `/kanban_columns/?team=${team}`,
            transformResponse: (response: any): IColumn[] =>
                response.map((unmappedColumn: any) =>
                    mapColumn(unmappedColumn)
            ),
        }),
        createColumn: builder.mutation<IColumn, IColumnCreate>({
            query: (data) => ({
                url: '/kanban_columns/',
                method: 'POST',
                body: data,
            }),
            transformResponse: (response: any): IColumn => mapColumn(response),
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
        }),
    }),
});


export const {
    useGetColumnsTeamQuery,
    useCreateColumnMutation,
    useUpdateColumnMutation,
    useUpdateColumnPositionMutation,
    useUpdateColumnNameMutation,
    useDeleteColumnMutation
} = columnApi