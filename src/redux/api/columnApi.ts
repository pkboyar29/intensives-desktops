import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import {
    IColumn,
} from '../../ts/interfaces/IColumn';

const mapColumn = (unmappedEvent: any): IColumn => {
    return {
      id: unmappedEvent.id,
      name: unmappedEvent.name,
      colorHEX: unmappedEvent.colorHEX,
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
        })
    }),
});


export const {
    useGetColumnsTeamQuery,
} = columnApi