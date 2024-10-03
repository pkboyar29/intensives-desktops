import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

import { ITeamToChoose } from '../../ts/interfaces/ITeam';

const mapTeamToChoose = (unmappedTeam: any): ITeamToChoose => {
  return {
    id: unmappedTeam.id,
    name: unmappedTeam.name,
  };
};

export const teamApi = createApi({
  reducerPath: 'teamApi',
  baseQuery,
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
