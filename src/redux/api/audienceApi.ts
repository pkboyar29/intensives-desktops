import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { IAudience } from '../../ts/interfaces/IAudience';

export const mapAudience = (unmappedAudience: any): IAudience => {
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
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAudiences: builder.query<IAudience[], void>({
      query: () => '/audiences/',
      transformResponse: (response: any): IAudience[] =>
        response.results.map((unmappedAudience: any) =>
          mapAudience(unmappedAudience)
        ),
    }),
  }),
});

export const { useGetAudiencesQuery } = audienceApi;
