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

export interface ITeamForManager extends Omit<ITeam, 'studentsInTeam' | 'id'> {
  studentsInTeam: IStudent[];
  index: number;
  id: number | null;
}

export interface ISupportTeamForManager
  extends Omit<ITeam, 'tutor' | 'mentor'> {
  tutor: {
    id: number;
    name: string;
  } | null;
  mentor: {
    id: number;
    name: string;
  } | null;
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
