import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { mapEvent } from './eventApi';
import { mapStage } from './stageApi';

import { IStage } from '../../ts/interfaces/IStage';
import { IEvent } from '../../ts/interfaces/IEvent';

export interface ISchedule {
  stages: IStage[];
  events: IEvent[];
}

const mapSchedule = (unmappedSchedule: any): ISchedule => {
  return {
    stages: unmappedSchedule.stages.map((stage: any) => mapStage(stage)),
    events: unmappedSchedule.events.map((event: any) => mapEvent(event)),
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
