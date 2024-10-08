import { createApi } from '@reduxjs/toolkit/query/react';
import { transformISODateToTime } from '../../helpers/dateHelpers';
import { baseQueryWithReauth } from './baseQuery';

import {
  IEventCreate,
  IEventUpdate,
  IManagerEvent,
} from '../../ts/interfaces/IEvent';

const mapManagerEvent = (unmappedEvent: any): IManagerEvent => {
  return {
    id: unmappedEvent.id,
    name: unmappedEvent.name,
    description: unmappedEvent.description,
    dateStart: unmappedEvent.start_dt.split('T')[0],
    dateEnd: unmappedEvent.finish_dt.split('T')[0],
    timeStart: transformISODateToTime(unmappedEvent.start_dt),
    timeEnd: transformISODateToTime(unmappedEvent.finish_dt),
    audience: unmappedEvent.auditory,
    stage: unmappedEvent.stage,
  };
};

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getEvent: builder.query<IManagerEvent, number>({
      query: (id) => `/events/${id}/`,
      transformResponse: (response: any): IManagerEvent =>
        mapManagerEvent(response),
    }),
    getEventsOnIntensive: builder.query<IManagerEvent[], number>({
      query: (intensiveId) => `/events/?intensiv=${intensiveId}`,
      transformResponse: (response: any): IManagerEvent[] =>
        response.results.map((unmappedManagerEvent: any) =>
          mapManagerEvent(unmappedManagerEvent)
        ),
    }),
    createEvent: builder.mutation<void, IEventCreate>({
      query: (data) => ({
        url: '/events/',
        method: 'POST',
        body: data,
      }),
    }),
    updateEvent: builder.mutation<void, IEventUpdate>({
      query: (data) => ({
        url: `/events/${data.eventId}/`,
        method: 'PATCH',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetEventsOnIntensiveQuery,
  useLazyGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
} = eventApi;
