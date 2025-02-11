import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import Cookies from 'js-cookie';

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  credentials: 'same-origin',
  prepareHeaders: async (headers) => {
    headers.set(`Authorization`, `Bearer ${Cookies.get('access')}`);

    return headers;
  },
  mode: 'cors',
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (
    result.error &&
    result.error.status === 401 &&
    api.endpoint !== 'signIn'
  ) {
    const refreshToken = Cookies.get('refresh');

    const refreshResult = await baseQuery(
      {
        method: 'POST',
        url: '/token/refresh/',
        body: {
          refresh: refreshToken,
        },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const responseBody: any = refreshResult.data;
      const accessToken = responseBody.access;

      Cookies.set('access', accessToken);

      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log('refresh token is invalid, logout');

      localStorage.removeItem('currentRole');
      Cookies.remove('access');
      Cookies.remove('refresh');

      // TODO: delete this weird code
      if (window.location.pathname === '/addTest') {
        console.log('hi');
      } else {
        window.location.href = '/sign-in';
      }
    }
  }

  return result;
};
