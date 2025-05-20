import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import { mapIntensiveMark } from './intensiveMarkApi';
import { mapStudent } from './studentApi';

import {
  IIntensiveAnswer,
  IIntensiveAnswerMark,
} from '../../ts/interfaces/IIntensiveAnswer';

const mapIntensiveAnswer = (unmappedAnswer: any): IIntensiveAnswer => {
  return {
    id: unmappedAnswer.id,
    text: unmappedAnswer.text,
    student: unmappedAnswer.student,
    createdDate: new Date(unmappedAnswer.created_at),
    updatedDate: new Date(unmappedAnswer.updated_at),
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
      { teamId?: number }
    >({
      query: ({ teamId }) => {
        const searchParams = new URLSearchParams();
        if (teamId) {
          searchParams.append('team_id', teamId.toString());
        }
        return `/intensive_answers/?${searchParams.toString()}`;
      },
      transformResponse: (response: any) =>
        response.map((unmappedAnswerMark: any) =>
          mapIntensiveAnswerMark(unmappedAnswerMark)
        ),
    }),
  }),
});

export const { useLazyGetIntensiveAnswersQuery } = intensiveAnswerApi;
