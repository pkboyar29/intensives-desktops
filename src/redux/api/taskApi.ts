import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { ITask, ITaskCreate } from '../../ts/interfaces/ITask';
import { addSubtask, addTask, deleteTask, setColumnTasks } from '../slices/kanbanSlice';

const mapTask = (unmappedEvent: any): ITask => {
  return {
    id: unmappedEvent.id,
    idTask: unmappedEvent.id_task,
    name: unmappedEvent.name,
    description: unmappedEvent.description,
    owner: unmappedEvent.owner,
    assignees: unmappedEvent.assignees,
    column: unmappedEvent.column,
    parentTask: unmappedEvent.parent_task,
    createdDt: unmappedEvent.created_dt,
    deadlineStartDt: unmappedEvent.deadline_start_dt,
    deadlineEndDt: unmappedEvent.deadline_end_dt,
    position: unmappedEvent.position,
    isCompleted: unmappedEvent.is_completed,
    subtasksCount: unmappedEvent.subtasks_count,
  };
};

export const taskApi = createApi({
    reducerPath: 'taskApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getTasksColumn: builder.query<
        { results: ITask[]; count: Number; next: string | null, previous: string | null},
        { column: number; page: number; pageSize: number }
        >({
          query: ({ column, page, pageSize }) => `/tasks/?column=${column}&page=${page}&page_size=${pageSize}`,
          transformResponse: (response: any) => ({
            results: response.results.map((unmappedTask: any) => mapTask(unmappedTask)),
            count: response.count,
            next: response.next,
            previous: response.previous,
          }),
          async onQueryStarted({ column }, {dispatch, queryFulfilled }) {
            try {
              const { data: columnTasks } = await queryFulfilled;

              // Диспатчим addColumnTasks для обновления состояния в slice kanban
              dispatch(setColumnTasks({ columnId: column, tasks: columnTasks.results }));
            } catch (err) {
              console.error('Error by getting tasks column:', err);
            }
          }
        }),
        createTask: builder.mutation<ITask, ITaskCreate>({
          query: (data) => ({
              url: '/tasks/',
              method: 'POST',
              body: {
                name: data.name,
                column: data?.column,
                parent_task: data?.parentTask
              },
          }),
          transformResponse: (response: any): ITask => mapTask(response),
          async onQueryStarted({ column, parentTask }, {dispatch, queryFulfilled }) {
            try {
              const { data: newTask } = await queryFulfilled;
              
              if(column) {
                // Если передан column, значит это обычная задача
                dispatch(addTask({ columnId: newTask.column, task: newTask }));
              } else if(parentTask) {
                // Если передан parentTask, значит это подзадача
                dispatch(addSubtask({ parentTaskId: newTask.column, subtask: newTask }));
              }
            } catch (err) {
              console.error('Error by getting tasks column:', err);
            }
          }
        }),
        deleteTask: builder.mutation<void, number>({
          query: (id) => ({
            url: `/tasks/${id}/`,
            method: 'DELETE',
          }),
          async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
            try{
              await queryFulfilled;
              
              dispatch(deleteTask(id));
            } catch (err: any) {
              if (err.error.status === 404) {
                console.warn(`Задача не найдена.`);
                dispatch(deleteTask(id)); // Удаляем задачу из состояния
              } else {
                console.error('Error deleting task:', err);
              }
            }
          }
        }),
    })
});

export const {
  useLazyGetTasksColumnQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation
} = taskApi;