 import { createApi } from '@reduxjs/toolkit/query/react';
 import { baseQueryWithReauth } from './baseQuery';
 import { IQuestion, IQuestionCreate } from '../../ts/interfaces/IQuestion';

 const mapQuestion = (unmappedQuestion: any): IQuestion => {
  return {
    id: unmappedQuestion.id,
    title: unmappedQuestion.title,
    description: unmappedQuestion.description,
    questionType: unmappedQuestion.question_type === "single" ? "Один вариант ответа" : "Несколько вариантов ответа",
    answerOptions: unmappedQuestion.answerOptions.map((option: any) => ({
      id: option.id,
      text: option.text,
      value: option.value,
    })),
  };
}

export const questionApi = createApi({
  reducerPath: 'questionApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Question'],
  endpoints: (builder) => ({
    createQuestion: builder.mutation<IQuestion, IQuestionCreate>({
      query: (question) => ({
        url: '/questions/',
        method: 'POST',
        body: {
          question_type: question.questionType,
          title: question.title,
          description: question.description,
          answerOptions: question.answerOptions?.map((option) => ({
            text: option.text,
            value: option.value,
          }))
        },
      }),
      invalidatesTags: ['Question'],
    }),
    updateQuestion: builder.mutation<IQuestion, { id: number; data: IQuestionCreate }>({
      query: ({ id, data }) => ({
        url: `/questions/${id}/`,
        method: 'PUT',
        body: {
          question_type: data.questionType,
          title: data.title,
          description: data.description,
          answerOptions: data.answerOptions?.map((option) => ({
            text: option.text,
            value: option.value,
          })),
        },
      }),
      invalidatesTags: ['Question'],
    }),
    deleteQuestion: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/questions/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Question'],
    }),
    getQuestions: builder.query<IQuestion[], void>({
      query: () => '/questions/',
      transformResponse: (response: any) =>
        response.results.map((unmappedQuestion: any) =>
          mapQuestion(unmappedQuestion)
        ),
      providesTags: ['Question'],
    }),
  }),
});

export const {
  useCreateQuestionMutation,
  useGetQuestionsQuery,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionApi;
