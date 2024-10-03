import { fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const baseQuery: BaseQueryFn = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  credentials: 'same-origin',
  prepareHeaders: async (headers) => {
    headers.set(`Authorization`, `Bearer ${Cookies.get('access')}`);

    return headers;
  },
  mode: 'cors',
});
