import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { mapStudent } from './studentApi';

import {
  ITeam,
  ITeamsCreate,
  ITeamForManager,
  ITeamToChoose,
} from '../../ts/interfaces/ITeam';

const mapTeamToChoose = (unmappedTeam: any): ITeamToChoose => {
  return {
    id: unmappedTeam.id,
    name: unmappedTeam.name,
  };
};

const mapTeamForManager = (unmappedTeam: any): ITeamForManager => {
  return {
    id: unmappedTeam.id,
    name: unmappedTeam.name,
    studentsInTeam: unmappedTeam.students_in_team.map((unmappedStudent: any) =>
      mapStudent(unmappedStudent.student)
    ),
  };
};

export const teamApi = createApi({
  reducerPath: 'teamApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getTeamsOnIntensive: builder.query<ITeamToChoose[], number>({
      query: (intensiveId) => `teams/?intensive=${intensiveId}`,
      transformResponse: (response: any): ITeamToChoose[] =>
        response.results.map((team: any) => mapTeamToChoose(team)),
    }),
    createTeams: builder.mutation<ITeamForManager[], ITeamsCreate>({
      query: (data) => ({
        url: `/teams/?intensive_id=${data.intensiveId}`,
        method: 'POST',
        body: data.teams.map((team) => ({
          name: team.name,
          student_ids: team.studentIds,
        })),
      }),
      transformResponse: (response: any) =>
        response.map((unmappedTeam: any) => mapTeamForManager(unmappedTeam)),
    }),
  }),
});

export const { useLazyGetTeamsOnIntensiveQuery, useCreateTeamsMutation } =
  teamApi;
