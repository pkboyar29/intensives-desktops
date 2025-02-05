import { IStudent } from './IStudent';
import { ITeacher } from './ITeacher';
import { IStudentRole } from './IStudentRole';

export interface ITeam {
  id: number;
  name: string;
  studentsInTeam: IStudentInTeam[];
  tutor: ITeacher | null;
  mentor: IStudent | null;
  teamlead: IStudent | null;
}

// TODO: использовать свойство index только в ITeamForManager (супер логично) и тогда id тут будет number | null, а в ITeam просто number
export interface ITeamForManager extends Omit<ITeam, 'studentsInTeam' | 'id'> {
  studentsInTeam: IStudent[];
  index: number;
  id: number | null;
}

export interface ITeamsCreate {
  teams: ITeamCreate[];
  intensiveId: number;
}

export interface ITeamCreate {
  id: number | null;
  name: string;
  studentIds: number[];
}

export interface ITeamsSupportMembersUpdate {
  teams: ITeamSupportMembersUpdate[];
  intensiveId: number;
}

export interface ITeamSupportMembersUpdate {
  id: number;
  tutorId: number | null;
  mentorId: number | null;
}

export interface ITeamleadChange {
  teamId: number;
  teamleadId: number | null;
}

export interface IStudentInTeam {
  student: IStudent;
  roles: IStudentRole[];
}

export interface IStudentRolesChange {
  studentId: number;
  roleIds: number[];
}

export interface IStudentsRolesChange {
  studentsInTeam: IStudentRolesChange[];
  teamId: number;
}
