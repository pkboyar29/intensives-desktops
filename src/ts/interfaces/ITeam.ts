import { IStudent } from './IStudent';
import { ITeacher } from './ITeacher';
import { IStudentRole } from './IStudentRole';

export interface ITeam {
  id: number;
  name: string;
  position: number;
  studentsInTeam: IStudentInTeam[];
  tutor: ITeacher | null;
  mentor: IStudent | null;
  teamlead: IStudent | null;
  projectName: string;
  projectDescription?: string;
}

export interface ITeamShort {
  id: number;
  name: string;
  position: number;
}

export interface ITeamManager extends Omit<ITeam, 'studentsInTeam' | 'id'> {
  studentsInTeam: IStudent[];
  index: number;
  id: number | null;
}

export interface ISupportTeamManager extends Omit<ITeam, 'tutor' | 'mentor'> {
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
  position: number;
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
  id?: number;
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

export interface IProjectInfoChange {
  teamId: number;
  projectName: string;
  projectDescription?: string;
}
