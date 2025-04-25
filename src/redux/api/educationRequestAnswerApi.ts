import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import {
  IEducationRequestAnswer,
  IEducationRequestAnswerSubmit,
  IEducationRequestAnswerUpdate,
} from '../../ts/interfaces/IEducationRequest';

export const mapEducationRequestAnswer = (
  unmappedAnswer: any
): IEducationRequestAnswer => ({
  id: unmappedAnswer.id,
  comment: unmappedAnswer.comment,
  managerId: unmappedAnswer.manager,
});

export const educationRequestAnswerApi = createApi({
  reducerPath: 'educationRequestAnswerApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    sendEducationRequestAnswer: builder.mutation<
      IEducationRequestAnswer,
      IEducationRequestAnswerSubmit
    >({
      query: ({ requestId, comment }) => ({
        url: `/education_request_answers/?education_request_id=${requestId}`,
        method: 'POST',
        body: {
          comment: comment,
        },
      }),
      transformResponse: (response: any) => mapEducationRequestAnswer(response),
    }),
    updateEducationRequestAnswer: builder.mutation<
      IEducationRequestAnswer,
      IEducationRequestAnswerUpdate
    >({
      query: ({ answerId, comment }) => ({
        url: `/education_request_answers/${answerId}/`,
        method: 'PUT',
        body: {
          comment: comment,
        },
      }),
      transformResponse: (response: any) => mapEducationRequestAnswer(response),
    }),
    deleteEducationRequestAnswer: builder.mutation<void, number>({
      query: (answerId) => ({
        url: `/education_request_answers/${answerId}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useSendEducationRequestAnswerMutation,
  useUpdateEducationRequestAnswerMutation,
  useDeleteEducationRequestAnswerMutation,
} = educationRequestAnswerApi;
