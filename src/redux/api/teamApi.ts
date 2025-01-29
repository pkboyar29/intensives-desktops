import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { mapStudent } from './studentApi';
import { mapTeacher } from './teacherApi';

import {
  ITeamsCreate,
  ITeam,
  ITeamsSupportMembersUpdate,
} from '../../ts/interfaces/ITeam';

export const mapTeam = (unmappedTeam: any): ITeam => {
  return {
    id: unmappedTeam.id,
    index: unmappedTeam.id,
    name: unmappedTeam.name,
    tutor: unmappedTeam.tutor === null ? null : mapTeacher(unmappedTeam.tutor),
    mentor:
      unmappedTeam.mentor === null ? null : mapStudent(unmappedTeam.mentor),
    studentsInTeam: unmappedTeam.students_in_team.map((unmappedStudent: any) =>
      mapStudent(unmappedStudent.student)
    ),
    teamlead:
      unmappedTeam.teamlead === null ? null : mapStudent(unmappedTeam.teamlead),
  };
};

export const teamApi = createApi({
  reducerPath: 'teamApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getTeams: builder.query<ITeam[], number>({
      query: (intensiveId) => `teams/?intensive_id=${intensiveId}`,
      transformResponse: (response: any): ITeam[] => {
        const teams: ITeam[] = response.results.map((team: any) =>
          mapTeam(team)
        );
        teams.sort((a, b) => a.name.localeCompare(b.name));

        return teams;
      },
    }),
    getTeam: builder.query<ITeam, number>({
      query: (teamId) => `teams/${teamId}`,
      transformResponse: (response: any): ITeam => mapTeam(response),
    }),
    changeAllTeams: builder.mutation<ITeam[], ITeamsCreate>({
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
        response.map((unmappedTeam: any) => mapTeam(unmappedTeam)),
    }),
    updateSupportMembers: builder.mutation<string, ITeamsSupportMembersUpdate>({
      query: (data) => ({
        url: `/teams/update_support_members/?intensive_id=${data.intensiveId}`,
        method: 'PUT',
        body: data.teams.map((team) => ({
          id: team.id,
          mentor_id: team.mentorId,
          tutor_id: team.tutorId,
        })),
      }),
    }),
    getMyTeam: builder.query<ITeam, number>({
      query: (intensiveId) => `/teams/my_team/?intensive_id=${intensiveId}`,
      transformResponse: (response: any): ITeam => mapTeam(response),
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useLazyGetTeamsQuery,
  useChangeAllTeamsMutation,
  useUpdateSupportMembersMutation,
  useLazyGetMyTeamQuery,
  useLazyGetTeamQuery,
} = teamApi;
