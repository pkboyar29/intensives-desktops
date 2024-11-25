import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { mapManagerEvent } from './eventApi';
import { mapStage } from './stageApi';

import { IStage } from '../../ts/interfaces/IStage';
import { IManagerEvent } from '../../ts/interfaces/IEvent';

export interface ISchedule {
  stages: IStage[];
  eventsWithoutStage: IManagerEvent[];
}

const mapSchedule = (unmappedSchedule: any): ISchedule => {
  return {
    stages: unmappedSchedule.stages.map((stageInSchedule: any) =>
      mapStage(stageInSchedule)
    ),
    eventsWithoutStage: unmappedSchedule.events_without_stage.map(
      (eventWithoutStage: any) => mapManagerEvent(eventWithoutStage)
    ),
  };
};

export const scheduleApi = createApi({
  reducerPath: 'scheduleApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getSchedule: builder.query<ISchedule, number>({
      query: (intensiveId) => `/schedule/?intensive_id=${intensiveId}`,
      transformResponse: (response: any) => mapSchedule(response),
    }),
  }),
});

export const { useGetScheduleQuery } = scheduleApi;
