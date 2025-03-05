import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import {
  IEventAnswer,
  IEventAnswerShort,
  IEventAnswerCreate,
  IEventAnswerUpdate,
} from '../../ts/interfaces/IEventAnswer';
import { IFile, IUploadFile } from '../../ts/interfaces/IFile';
import { mapFile } from './fileApi';

export const mapEventAnswer = (unmappedEventAnswer: any): IEventAnswer => {
  return {
    id: unmappedEventAnswer.id,
    text: unmappedEventAnswer.text,
    student: unmappedEventAnswer.student,
    team: unmappedEventAnswer.team,
    createdDate: unmappedEventAnswer.created_at,
    files: unmappedEventAnswer.files,
    marks: unmappedEventAnswer.marks,
    hasMarks: unmappedEventAnswer.has_marks,
  };
};

export const mapEventAnswerShort = (
  unmappedEventAnswer: any
): IEventAnswerShort => {
  return {
    id: unmappedEventAnswer.id,
    createdDate: unmappedEventAnswer.created_at,
    hasMarks: unmappedEventAnswer.has_marks,
  };
};

export const eventAnswerApi = createApi({
  reducerPath: 'eventAnswerApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getEventAnswers: builder.query<IEventAnswer[], number>({
      query: (eventId) => `/event_answers/?event=${eventId}`,
      transformResponse: (response: any): IEventAnswer[] =>
        response.map((unmappedEventAnswer: any) =>
          mapEventAnswer(unmappedEventAnswer)
        ),
    }),
    getEventAnswer: builder.query<IEventAnswer, number>({
      query: (eventAnswerId) => `/event_answers/${eventAnswerId}`,
      transformResponse: (response: any): IEventAnswer =>
        mapEventAnswer(response),
    }),
    createEventAnswer: builder.mutation<IEventAnswer, IEventAnswerCreate>({
      query: (data) => ({
        url: '/event_answers/',
        method: 'POST',
        body: {
          event: data.event,
          text: data.text,
        },
      }),
      transformResponse: (response: any): IEventAnswer =>
        mapEventAnswer(response),
    }),
    updateEventAnswer: builder.mutation<IEventAnswer, IEventAnswerUpdate>({
      query: (data) => ({
        url: `/event_answers/${data.id}/`,
        method: 'PATCH',
        body: {
          text: data.text,
          fileIds: data.fileIds,
        },
      }),
      transformResponse: (response: any): IEventAnswer =>
        mapEventAnswer(response),
    }),
    deleteEventAnswer: builder.mutation<void, number>({
      query: (id) => ({
        url: `/event_answers/${id}/`,
        method: 'DELETE',
      }),
    }),
    uploadFiles: builder.mutation<IFile[], IUploadFile>({
      query: ({ contextId, files }) => {
        const formData = new FormData();
        if (Array.isArray(files)) {
          files.forEach((file) => formData.append('files', file));
        } else {
          formData.append('files', files);
        }

        return {
          url: `/event_answers/${contextId}/files/upload/`,
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: any): IFile[] =>
        response.map((unmappedColumn: any) => mapFile(unmappedColumn)),
    }),
  }),
});

export const {
  useLazyGetEventAnswersQuery,
  useLazyGetEventAnswerQuery,
  useCreateEventAnswerMutation,
  useUpdateEventAnswerMutation,
  useDeleteEventAnswerMutation,
  useUploadFilesMutation,
} = eventAnswerApi;
