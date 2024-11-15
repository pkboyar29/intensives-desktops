import { createApi } from '@reduxjs/toolkit/query/react';
import { transformSeparateDateAndTimeToISO } from '../../helpers/dateHelpers';
import { baseQueryWithReauth } from './baseQuery';

import {
  IEventCreate,
  IEventUpdate,
  IManagerEvent,
} from '../../ts/interfaces/IEvent';
import { mapTeamForManager } from './teamApi';
import { mapAudience } from './audienceApi';
import { mapTeacherEvent } from './teacherApi';
import { mapMarkStrategy } from './markStrategyApi';
import { mapEventCriteria } from './criteriaApi';

export const mapManagerEvent = (unmappedEvent: any): IManagerEvent => {
  return {
    id: unmappedEvent.id,
    name: unmappedEvent.name,
    description: unmappedEvent.description,
    startDate: new Date(unmappedEvent.start_dt),
    finishDate: new Date(unmappedEvent.finish_dt),
    audience: mapAudience(unmappedEvent.audience),
    stageId: unmappedEvent.stage === null ? 0 : unmappedEvent.stage.id,
    teams: unmappedEvent.teams.map((unmappedTeam: any) =>
      mapTeamForManager(unmappedTeam)
    ),
    experts: unmappedEvent.experts.map((unmappedExpert: any) =>
      mapTeacherEvent(unmappedExpert)
    ),
    markStrategy:
      unmappedEvent.mark_strategy &&
      mapMarkStrategy(unmappedEvent.mark_strategy),
    criterias: unmappedEvent.criterias.map((unmappedCriteria: any) =>
      mapEventCriteria(unmappedCriteria)
    ),
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
        body: {
          ...data,
          intensive: data.intensiveId,
          teams: data.teamIds,
          teacher_on_intensive_ids: data.teacherOnIntensiveIds,
          start_dt: transformSeparateDateAndTimeToISO(
            data.startDate,
            data.startTime
          ),
          finish_dt: transformSeparateDateAndTimeToISO(
            data.finishDate,
            data.finishTime
          ),
          mark_strategy: data.markStrategy ? data.markStrategy : null,
          criteria_ids: data.criteriaIds ? data.criteriaIds : [],
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
          teams: data.teamIds,
          teacher_on_intensive_ids: data.teacherOnIntensiveIds,
          start_dt: transformSeparateDateAndTimeToISO(
            data.startDate,
            data.startTime
          ),
          finish_dt: transformSeparateDateAndTimeToISO(
            data.finishDate,
            data.finishTime
          ),
          mark_strategy: data.markStrategy ? data.markStrategy : null,
          criteria_ids: data.criteriaIds ? data.criteriaIds : [],
          files: [],
        },
      }),
    }),
  }),
});

export const {
  useGetEventsOnIntensiveQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
} = eventApi;
