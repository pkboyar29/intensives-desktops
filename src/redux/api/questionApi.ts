 import { createApi } from '@reduxjs/toolkit/query/react'; // основа RTK Query для объявления эндпоинтов (запросов и мутаций)
 import { baseQueryWithReauth } from './baseQuery'; // базовый запрос с авторизацией и логикой повторной аутентификации
 import { IQuestion, IQuestionCreate } from '../../ts/interfaces/IQuestion';
// Сервер возвращает поле question_type как "single" или "multiple" — эта функция преобразует их в человекочитаемые строки
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
  reducerPath: 'questionApi', // имя редьюсера в Redux state
  baseQuery: baseQueryWithReauth, // обёртка над fetch, включающая, например, токены
  tagTypes: ['Question'], // Добавляем тег для кэширования
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
      invalidatesTags: ['Question'], // Указываем, что эта мутация инвалидирует кэш с тегом 'Question' - зачем?
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
      providesTags: ['Question'], // Указываем, что этот запрос предоставляет данные с тегом 'Question'
    }),
  }),
});
// transformResponse — преобразует "сырой" ответ от API (response.results) в формат IQuestion, понятный клиенту

export const {
  useCreateQuestionMutation,
  useGetQuestionsQuery,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionApi; // хуки для вопросов
