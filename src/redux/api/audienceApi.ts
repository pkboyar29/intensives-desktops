import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

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
  baseQuery,
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
