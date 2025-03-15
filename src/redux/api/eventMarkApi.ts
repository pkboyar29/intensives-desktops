import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import {
  IEventMark,
  IEventMarkAvg,
  IEventMarksCreate,
  IEventMarkUpdate,
} from '../../ts/interfaces/IEventMark';
import { mapCriteria } from './criteriaApi';
import { mapTeacher } from './teacherApi';

export const mapEventMark = (
  unmappedEventMark: any
): IEventMark | IEventMarkAvg => {
  if (unmappedEventMark.average_mark !== undefined) {
    // Если пришёл ответ со средним баллом мапим в IEventMarkAvg
    return {
      criteria: unmappedEventMark.criteria
        ? mapCriteria(unmappedEventMark.criteria)
        : undefined,
      avgMark: unmappedEventMark.average_mark,
    };
  } else {
    return {
      id: unmappedEventMark.id,
      mark: unmappedEventMark.mark,
      comment: unmappedEventMark.comment,
      criteria: unmappedEventMark.criteria
        ? mapCriteria(unmappedEventMark.criteria)
        : undefined,
      createdDate: unmappedEventMark.created_dt,
      updatedDate: unmappedEventMark.updated_dt,
      teacher: mapTeacher(unmappedEventMark.teacher),
      eventAnswerId: unmappedEventMark.event_answer,
    };
  }
};

export const eventMarkApi = createApi({
  reducerPath: 'eventMarkApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createEventMark: builder.mutation<IEventMark[], IEventMarksCreate>({
      query: (data) => ({
        url: `/event_marks/?event_answer_id=${data.eventAnswerId}`,
        method: 'POST',
        body: data.marksToCreate.map((eventMark) => ({
          ...eventMark,
        })),
      }),
      transformResponse: (response: any) =>
        response.map((unmappedMark: any) => mapEventMark(unmappedMark)),
    }),
    updateEventMark: builder.mutation<IEventMark, IEventMarkUpdate>({
      query: (data) => ({
        url: `/event_marks/${data.eventMarkId}/`,
        method: 'PUT',
        body: {
          mark: data.mark,
          comment: data.comment,
        },
      }),
    }),
  }),
});

export const { useCreateEventMarkMutation, useUpdateEventMarkMutation } =
  eventMarkApi;
