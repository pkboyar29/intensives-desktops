import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import { ITest, ITestCreate } from '../../ts/interfaces/ITest';

export const testApi = createApi({
  reducerPath: 'testApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Test'],
  endpoints: (builder) => ({
    getTests: builder.query<ITest[], void>({
      query: () => '/tests/',
      transformResponse: (response: any) => response.results, // Преобразуем ответ, чтобы вернуть только массив тестов
      providesTags: ['Test'],
    }),
    createTest: builder.mutation<ITest, ITestCreate>({
      query: (test) => ({
        url: '/tests/',
        method: 'POST',
        body: test,
      }),
      invalidatesTags: ['Test'],
    }),
    updateTest: builder.mutation<ITest, { id: number; data: ITestCreate }>({
      query: ({ id, data }) => ({
        url: `/tests/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Test'],
    }),
    deleteTest: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/tests/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Test'],
    }),
  }),
});

export const {
  useGetTestsQuery,
  useCreateTestMutation,
  useUpdateTestMutation,
  useDeleteTestMutation,
} = testApi;
