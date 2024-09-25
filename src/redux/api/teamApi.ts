import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

import { ITeamToChoose } from '../../ts/interfaces/ITeam';

const mapTeamToChoose = (unmappedTeam: any): ITeamToChoose => {
  return {
    id: unmappedTeam.id,
    name: unmappedTeam.name,
  };
};

export const teamApi = createApi({
  reducerPath: 'teamApi',
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
    getTeamsOnIntensive: builder.query<ITeamToChoose[], number>({
      query: (intensiveId) =>
        `commands_on_intensives/?intensive=${intensiveId}`,
      transformResponse: (response: any): ITeamToChoose[] =>
        response.results.map((team: any) => mapTeamToChoose(team)),
    }),
  }),
});

export const { useLazyGetTeamsOnIntensiveQuery } = teamApi;
