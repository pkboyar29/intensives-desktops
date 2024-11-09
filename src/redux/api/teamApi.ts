import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { mapStudent } from './studentApi';
import { mapTeacherOnIntensive } from './teacherApi';

import {
  ITeamsCreate,
  ITeamSupportMembersUpdate,
  ITeamForManager,
} from '../../ts/interfaces/ITeam';

export const mapTeamForManager = (unmappedTeam: any): ITeamForManager => {
  return {
    id: unmappedTeam.id,
    index: unmappedTeam.id,
    name: unmappedTeam.name,
    tutor:
      unmappedTeam.tutor === null
        ? null
        : mapTeacherOnIntensive(unmappedTeam.tutor),
    mentor:
      unmappedTeam.mentor === null ? null : mapStudent(unmappedTeam.mentor),
    studentsInTeam: unmappedTeam.students_in_team.map((unmappedStudent: any) =>
      mapStudent(unmappedStudent.student)
    ),
  };
};

export const teamApi = createApi({
  reducerPath: 'teamApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getTeams: builder.query<ITeamForManager[], number>({
      query: (intensiveId) => `teams/?intensive_id=${intensiveId}`,
      transformResponse: (response: any): ITeamForManager[] => {
        const teams: ITeamForManager[] = response.results.map((team: any) =>
          mapTeamForManager(team)
        );
        teams.sort((a, b) => a.name.localeCompare(b.name));

        return teams;
      },
    }),
    changeAllTeams: builder.mutation<ITeamForManager[], ITeamsCreate>({
      query: (data) => ({
        url: `/teams/change_all_teams/?intensive_id=${data.intensiveId}`,
        method: 'POST',
        body: data.teams.map((team) => ({
          id: team.id,
          name: team.name,
          student_ids: team.studentIds,
        })),
      }),
      transformResponse: (response: any) =>
        response.map((unmappedTeam: any) => mapTeamForManager(unmappedTeam)),
    }),
    updateSupportMembers: builder.mutation<string, ITeamSupportMembersUpdate[]>(
      {
        query: (data) => ({
          url: `/teams/update_support_members/`,
          method: 'PATCH',
          body: data.map((team) => ({
            id: team.id,
            mentor_id: team.mentorId,
            tutor_id: team.tutorId,
          })),
        }),
        // transformResponse: (response: any) =>
      }
    ),
  }),
});

export const {
  useGetTeamsQuery,
  useLazyGetTeamsQuery,
  useChangeAllTeamsMutation,
  useUpdateSupportMembersMutation,
} = teamApi;
