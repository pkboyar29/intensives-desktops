import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import {
  IEventCreate,
  IEventUpdate,
  IEvent,
  IEventUpdateVisibility,
} from '../../ts/interfaces/IEvent';
import { mapTeam } from './teamApi';
import { mapAudience } from './audienceApi';
import { mapTeacher } from './teacherApi';
import { mapMarkStrategy } from './markStrategyApi';
import { mapCriteria } from './criteriaApi';

export const mapEvent = (unmappedEvent: any): IEvent => {
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
    deadlineDate: unmappedEvent.deadline_dt
      ? new Date(unmappedEvent.deadline_dt)
      : null,
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
      transformResponse: (response: any): IEvent => mapEvent(response),
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
          deadline_dt: data.deadlineDate,
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
          deadline_dt: data.deadlineDate,
          files: [],
        },
      }),
    }),
    updateVisibility: builder.mutation<void, IEventUpdateVisibility>({
      query: (data) => ({
        url: `/events/${data.eventId}/`,
        method: 'PATCH',
        body: {
          visibility: data.visibility,
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
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useUpdateVisibilityMutation,
  useDeleteEventMutation,
} = eventApi;
