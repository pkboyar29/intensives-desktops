import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth, buildUrl } from './baseQuery';
import { mapIntensiveMark } from './intensiveMarkApi';
import { mapStudent } from './studentApi';

import {
  IIntensiveAnswer,
  IIntensiveAnswerCreate,
  IIntensiveAnswerMark,
  IIntensiveAnswerUpdate,
} from '../../ts/interfaces/IIntensiveAnswer';
import { mapFile } from './fileApi';

const mapIntensiveAnswer = (unmappedAnswer: any): IIntensiveAnswer => {
  return {
    id: unmappedAnswer.id,
    text: unmappedAnswer.text,
    student: unmappedAnswer.student,
    createdDate: new Date(unmappedAnswer.created_at),
    updatedDate: new Date(unmappedAnswer.updated_at),
    files: unmappedAnswer.files.map((file: any) => mapFile(file)),
  };
};

const mapIntensiveAnswerMark = (
  unmappedAnswerMark: any
): IIntensiveAnswerMark => {
  return {
    student: mapStudent(unmappedAnswerMark.student),
    intensiveAnswer: unmappedAnswerMark.intensive_answer
      ? mapIntensiveAnswer(unmappedAnswerMark.intensive_answer)
      : null,
    intensiveMark: unmappedAnswerMark.intensive_mark
      ? mapIntensiveMark(unmappedAnswerMark.intensive_mark)
      : null,
  };
};

export const intensiveAnswerApi = createApi({
  reducerPath: 'intensiveAnswerApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getIntensiveAnswers: builder.query<
      IIntensiveAnswerMark[],
      { team_id?: number; intensive_id?: number }
    >({
      query: (args) => buildUrl('/intensive_answers', args),
      transformResponse: (response: any) =>
        response.map((unmappedAnswerMark: any) =>
          mapIntensiveAnswerMark(unmappedAnswerMark)
        ),
    }),
    createIntensiveAnswer: builder.mutation<
      IIntensiveAnswer,
      IIntensiveAnswerCreate
    >({
      query: (data) => ({
        url: `/intensive_answers/`,
        method: 'POST',
        body: {
          text: data.text,
          intensive: data.intensiveId,
        },
      }),
      transformResponse: (response: any): IIntensiveAnswer =>
        mapIntensiveAnswer(response),
    }),
    updateInstensiveAnswer: builder.mutation<
      IIntensiveAnswer,
      IIntensiveAnswerUpdate
    >({
      query: (data) => ({
        url: `/intensive_answers/${data.id}/`,
        method: 'PATCH',
        body: {
          text: data.text,
          file_ids: data.fileIds,
        },
      }),
      transformResponse: (response: any): IIntensiveAnswer =>
        mapIntensiveAnswer(response),
    }),
  }),
});

export const {
  useLazyGetIntensiveAnswersQuery,
  useCreateIntensiveAnswerMutation,
  useUpdateInstensiveAnswerMutation,
} = intensiveAnswerApi;
