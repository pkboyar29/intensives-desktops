import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { IEventCreate, IEventUpdate, IEvent } from '../../ts/interfaces/IEvent';
import { mapTeam } from './teamApi';
import { mapAudience } from './audienceApi';
import { mapTeacher } from './teacherApi';
import { mapMarkStrategy } from './markStrategyApi';
import { mapCriteria } from './criteriaApi';

export const mapManagerEvent = (unmappedEvent: any): IEvent => {
  return {
    id: unmappedEvent.id,
    name: unmappedEvent.name,
    description: unmappedEvent.description,
    startDate: new Date(unmappedEvent.start_dt),
    finishDate: new Date(unmappedEvent.finish_dt),
    audience: mapAudience(unmappedEvent.audience),
    visibility: unmappedEvent.visibility,
    stageId: unmappedEvent.stage === null ? null : unmappedEvent.stage.id,
    teams: unmappedEvent.teams.map((unmappedTeam: any) =>
      mapTeam(unmappedTeam)
    ),
    teachers: unmappedEvent.teachers.map((unmappedTeacher: any) =>
      mapTeacher(unmappedTeacher)
    ),
    markStrategy:
      unmappedEvent.mark_strategy &&
      mapMarkStrategy(unmappedEvent.mark_strategy),
    criterias: unmappedEvent.criterias.map((unmappedCriteria: any) =>
      mapCriteria(unmappedCriteria)
    ),
  };
};

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getEvent: builder.query<IEvent, number>({
      query: (id) => `/events/${id}/`,
      transformResponse: (response: any): IEvent => mapManagerEvent(response),
    }),
    getEventsOnIntensive: builder.query<IEvent[], number>({
      query: (intensiveId) => `/events/?intensiv=${intensiveId}`,
      transformResponse: (response: any): IEvent[] =>
        response.results.map((unmappedManagerEvent: any) =>
          mapManagerEvent(unmappedManagerEvent)
        ),
    }),
    createEvent: builder.mutation<void, IEventCreate>({
      query: (data) => ({
        url: '/events/',
        method: 'POST',
        body: {
          ...data,
          intensive: data.intensiveId,
          stage: data.stageId,
          audience: data.audienceId,
          teams: data.teamIds,
          teachers: data.teacherIds,
          start_dt: data.startDate,
          finish_dt: data.finishDate,
          mark_strategy: data.markStrategyId,
          criterias: data.criteriaIds,
          files: [],
        },
      }),
    }),
    updateEvent: builder.mutation<void, IEventUpdate>({
      query: (data) => ({
        url: `/events/${data.eventId}/`,
        method: 'PUT',
        body: {
          ...data,
          intensive: data.intensiveId,
          stage: data.stageId,
          audience: data.audienceId,
          teams: data.teamIds,
          teachers: data.teacherIds,
          start_dt: data.startDate,
          finish_dt: data.finishDate,
          mark_strategy: data.markStrategyId,
          criterias: data.criteriaIds,
          files: [],
        },
      }),
    }),
    deleteEvent: builder.mutation<void, number>({
      query: (eventId) => ({
        url: `/events/${eventId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetEventsOnIntensiveQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi;
