import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { ITask, ITaskCreate } from '../../ts/interfaces/ITask';


const mapTask = (unmappedEvent: any): ITask => {
  return {
    id_task: unmappedEvent.id_task,
    name: unmappedEvent.name,
    description: unmappedEvent.description,
    owner: unmappedEvent.owner,
    assignees: unmappedEvent.assignees,
    column: unmappedEvent.column,
    parent_task: unmappedEvent.parent_task,
    created_dt: unmappedEvent.created_dt,
    deadline_start_dt: unmappedEvent.deadline_start_dt,
    deadline_end_dt: unmappedEvent.deadline_end_dt,
    position: unmappedEvent.position,
    is_completed: unmappedEvent.is_completed,
    subtasks_count: unmappedEvent.subtasks_count,
  };
};

export const taskApi = createApi({
    reducerPath: 'taskApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        //getColumnsTeam: builder.query<ITask[], number>({
        //    query: (team) => `/kanban_columns/?team=${team}`,
        //    transformResponse: (response: any): IColumn[] =>
        //        response.map((unmappedColumn: any) => mapColumn(unmappedColumn)),
        //}),
        createTask: builder.mutation<ITask, ITaskCreate>({
            query: (data) => ({
                url: '/tasks/',
                method: 'POST',
                body: data,
            }),
            transformResponse: (response: any): ITask => mapTask(response),
        }),
    }),
});

export const {
  //useLazyGetColumnsTeamQuery,
  useCreateTaskMutation,
} = taskApi;