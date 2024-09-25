import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

import { IAudience } from '../../ts/interfaces/IAudience';

const mapAudience = (unmappedAudience: any): IAudience => {
  return {
    id: unmappedAudience.id,
    name:
      unmappedAudience.building.address +
      ' Корпус ' +
      unmappedAudience.building.name +
      ' Аудитория ' +
      unmappedAudience.name,
  };
};

export const audienceApi = createApi({
  reducerPath: 'audienceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: 'same-origin',
    prepareHeaders: async (headers) => {
      headers.set(`Authorization`, `Bearer ${Cookies.get('access')}`);

      return headers;
    },
    mode: 'cors',
  }),
  endpoints: (builder) => ({
    getAudiences: builder.query<IAudience[], void>({
      query: () => '/auditories/',
      transformResponse: (response: any): IAudience[] =>
        response.results.map((unmappedAudience: any) =>
          mapAudience(unmappedAudience)
        ),
    }),
  }),
});

export const { useLazyGetAudiencesQuery } = audienceApi;
