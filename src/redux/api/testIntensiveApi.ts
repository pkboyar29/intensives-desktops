import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const testIntensiveApi = createApi({
  reducerPath: 'testIntensiveApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getIntensiveTest: builder.query({
      query: (intensiveId) => {
        console.log('g');
        return `intensive_tests/?intensive_id=${intensiveId}`;
      },
    }),
    attachTest: builder.mutation({
      query: ({ intensiveId, testId, startDate, endDate, attempts }) => ({
        url: `intensive_tests/?intensive_id=${intensiveId}`,
        method: 'POST',
        body: {
          intensive: intensiveId,
          test_id: testId,
          start_date: startDate,
          end_date: endDate,
          attempts_allowed: attempts,
        },
      }),
    }),
    detachTest: builder.mutation({
      query: ({ pk }) => ({
        url: `intensive_tests/${pk}/`,
        method: 'DELETE',
      }),
    }),
    editTest: builder.mutation({
      query: ({ pk, startDate, endDate, attempts }) => ({
        url: `intensive_tests/${pk}/`,
        method: 'PATCH',
        body: {
          start_date: startDate,
          end_date: endDate,
          attempts_allowed: attempts,
        },
      }),
    }),
  }),
});

export const {
  useLazyGetIntensiveTestQuery,
  useAttachTestMutation,
  useDetachTestMutation,
  useEditTestMutation,
} = testIntensiveApi;
