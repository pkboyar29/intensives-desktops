import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import Cookies from 'js-cookie';
import { Mutex } from 'async-mutex';

const mutex = new Mutex();

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  credentials: 'same-origin',
  prepareHeaders: (headers, { endpoint }) => {
    headers.set(`Authorization`, `Bearer ${Cookies.get('access')}`);
    if (endpoint !== 'getUser') {
      headers.set(`X-Active-Role`, localStorage.getItem('currentRole')!);
    }
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
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
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
          localStorage.removeItem('currentRole');
          Cookies.remove('access');
          Cookies.remove('refresh');
          window.location.href = '/sign-in';
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const buildUrl = (
  basePath: string,
  queryParams: Record<string, any>
) => {
  const params = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });

  return `${basePath}${params.toString() ? `?${params.toString()}` : ''}`;
};

export const mapIfExists = <T, R>(
  value: T | undefined,
  mapper: (val: T) => R
): R | undefined => (value ? mapper(value) : undefined);
