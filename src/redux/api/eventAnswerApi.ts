import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import {
  IEvenetAnswer,
  IEvenetAnswerCreate,
} from '../../ts/interfaces/IEventAnswer';
import { IFile, IUploadFile } from '../../ts/interfaces/IFile';
import { mapFile } from './fileApi';

export const mapEventAnswer = (unmappedEventAnswer: any): IEvenetAnswer => {
  return {
    id: unmappedEventAnswer.id,
    text: unmappedEventAnswer.text,
    student: unmappedEventAnswer.student,
    createdDt: unmappedEventAnswer.created_at,
    files: unmappedEventAnswer.files,
  };
};

export const eventAnswerApi = createApi({
  reducerPath: 'eventAnswerApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getEventAnswers: builder.query<IEvenetAnswer[], number>({
      query: (eventId) => `'/event_answer/?event=${eventId}'`,
      transformResponse: (response: any): IEvenetAnswer[] =>
        response.results.map((unmappedEventAnswer: any) =>
          mapEventAnswer(unmappedEventAnswer)
        ),
    }),
    createEventAnswer: builder.mutation<IEvenetAnswer, IEvenetAnswerCreate>({
      query: (data) => ({
        url: '/event_answer/',
        method: 'POST',
        body: {
          event: data.event,
          text: data.text,
        },
      }),
      transformResponse: (response: any): IEvenetAnswer =>
        mapEventAnswer(response),
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
          url: `event_answer/${contextId}/files/upload/`,
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
  useGetEventAnswersQuery,
  useCreateEventAnswerMutation,
  useUploadFilesMutation,
} = eventAnswerApi;
