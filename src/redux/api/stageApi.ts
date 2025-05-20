import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { IStage, IStageCreate, IStageUpdate } from '../../ts/interfaces/IStage';

export const mapStage = (unmappedStage: any): IStage => {
  return {
    id: unmappedStage.id,
    name: unmappedStage.name,
    description: unmappedStage.description,
    startDate: new Date(unmappedStage.start_dt),
    finishDate: new Date(unmappedStage.finish_dt),
  };
};

export const stageApi = createApi({
  reducerPath: 'stageApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getStagesForIntensive: builder.query<IStage[], number>({
      query: (intensiveId) => `/stages/?intensive_id=${intensiveId}`,
      transformResponse: (response: any): IStage[] =>
        response.map((unmappedStage: any) => mapStage(unmappedStage)),
    }),
    createStage: builder.mutation<IStage, IStageCreate>({
      query: (data) => ({
        url: `/stages/?intensive_id=${data.intensiveId}`,
        method: 'POST',
        body: {
          ...data,
          start_dt: data.startDate,
          finish_dt: data.finishDate,
        },
      }),
      transformResponse: (response: any): IStage => mapStage(response),
    }),
    updateStage: builder.mutation<IStage, IStageUpdate>({
      query: (data) => ({
        url: `stages/${data.id}/`,
        method: 'PUT',
        body: {
          ...data,
          // TODO: запретить передавать тут intensiveId?
          intensive: data.intensiveId,
          start_dt: data.startDate,
          finish_dt: data.finishDate,
        },
      }),
      transformResponse: (response: any): IStage => mapStage(response),
    }),
    deleteStage: builder.mutation<string, number>({
      query: (stageId) => ({
        url: `stages/${stageId}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetStagesForIntensiveQuery,
  useCreateStageMutation,
  useUpdateStageMutation,
  useDeleteStageMutation,
} = stageApi;
