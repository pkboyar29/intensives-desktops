import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { mapEventShort } from './eventApi';
import { mapStage } from './stageApi';

import { IStage } from '../../ts/interfaces/IStage';
import { IEventShort } from '../../ts/interfaces/IEvent';

export interface ISchedule {
  stages: IStage[];
  events: IEventShort[];
}

const mapSchedule = (unmappedSchedule: any): ISchedule => {
  return {
    stages: unmappedSchedule.stages.map((stage: any) => mapStage(stage)),
    events: unmappedSchedule.events.map((event: any) => mapEventShort(event)),
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
