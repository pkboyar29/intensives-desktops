import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { mapStudent } from './studentApi';
import { mapTeacher } from './teacherApi';
import { mapStudentRole } from './studentRoleApi';

import {
  ITeamsCreate,
  ITeam,
  ITeamsSupportMembersUpdate,
  ITeamleadChange,
  IStudentsRolesChange,
  IProjectInfoChange,
  ITeamShort,
} from '../../ts/interfaces/ITeam';

export const mapTeam = (unmappedTeam: any): ITeam => {
  return {
    id: unmappedTeam.id,
    name: unmappedTeam.name,
    position: unmappedTeam.position,
    tutor: unmappedTeam.tutor === null ? null : mapTeacher(unmappedTeam.tutor),
    mentor:
      unmappedTeam.mentor === null ? null : mapStudent(unmappedTeam.mentor),
    studentsInTeam: unmappedTeam.students_in_team.map(
      (unmappedStudent: any) => ({
        id: unmappedStudent.id && unmappedStudent.id,
        student: mapStudent(unmappedStudent.student),
        roles: unmappedStudent.roles.map((unmappedRole: any) =>
          mapStudentRole(unmappedRole)
        ),
      })
    ),
    teamlead:
      unmappedTeam.teamlead === null ? null : mapStudent(unmappedTeam.teamlead),
    projectName: unmappedTeam.project_name,
    projectDescription: unmappedTeam.project_description,
  };
};

export const mapTeamShort = (unmappedTeam: any): ITeamShort => {
  return {
    id: unmappedTeam.id,
    name: unmappedTeam.name,
    position: unmappedTeam.position,
  };
};

export const teamApi = createApi({
  reducerPath: 'teamApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getTeams: builder.query<
      ITeam[] | ITeamShort[],
      { intensiveId: number; short: boolean; tutor?: boolean }
    >({
      query: ({ intensiveId, short, tutor = false }) =>
        `teams/?intensive_id=${intensiveId}&short=${short}&tutor=${tutor}`,
      transformResponse: (response: any): ITeam[] | ITeamShort[] => {
        const teams = response.map((team: any) => {
          if ('students_in_team' in team) {
            return mapTeam(team);
          } else {
            return mapTeamShort(team);
          }
        });

        teams.sort(
          (a: ITeam | ITeamShort, b: ITeam | ITeamShort) =>
            a.position - b.position
        );

        return teams;
      },
    }),
    getTeam: builder.query<ITeam | null, number>({
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
          position: team.position,
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
    changeTeamlead: builder.mutation<string, ITeamleadChange>({
      query: (data) => ({
        url: `/teams/${data.teamId}/update_teamlead/`,
        method: 'PUT',
        body: {
          teamlead_id: data.teamleadId,
        },
      }),
    }),
    changeStudentRoles: builder.mutation<string, IStudentsRolesChange>({
      query: (data) => ({
        url: `/teams/${data.teamId}/change_student_roles/`,
        method: 'PUT',
        body: data.studentsInTeam.map((studentInTeam) => ({
          student_id: studentInTeam.studentId,
          student_roles: studentInTeam.roleIds,
        })),
      }),
    }),
    changeProjectInfo: builder.mutation<string, IProjectInfoChange>({
      query: (data) => ({
        url: `/teams/${data.teamId}/change_project_info/`,
        method: 'PUT',
        body: {
          project_name: data.projectName,
          project_description: data.projectDescription,
        },
      }),
    }),
    getMyTeam: builder.query<ITeam | null, number>({
      query: (intensiveId) => `/teams/my_team/?intensive_id=${intensiveId}`,
      transformResponse: (response: any): ITeam | null =>
        response ? mapTeam(response) : null,
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useLazyGetTeamsQuery,
  useChangeAllTeamsMutation,
  useUpdateSupportMembersMutation,
  useChangeTeamleadMutation,
  useChangeStudentRolesMutation,
  useChangeProjectInfoMutation,
  useLazyGetMyTeamQuery,
  useLazyGetTeamQuery,
} = teamApi;
