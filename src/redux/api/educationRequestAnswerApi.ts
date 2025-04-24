import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const mapEducationRequestAnswer = (unmappedAnswer: any) => {
  return;
};

export const educationRequestAnswerApi = createApi({
  reducerPath: 'educationRequestAnswerApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
