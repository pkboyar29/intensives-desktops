import { IStudent } from './IStudent';
import { ITeacher } from './ITeacher';

// TODO: delete when team context deleted
export interface ITeam {
  id: number;
  name: string;
  tutorId?: number | null;
  tutorNameSurname?: string | null;
  mentorId?: number | null;
  mentorNameSurname?: string | null;
  intensiveId: number;
}

// TODO: rename to ITeam, when Iteam will be deleted
export interface ITeamForManager {
  id: number | null;
  index: number;
  name: string;
  studentsInTeam: IStudent[];
  tutor: ITeacher | null;
  mentor: IStudent | null;
  teamleadId?: number;
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

export interface ITeamSupportMembersUpdate {
  id: number;
  tutorId: number | null;
  mentorId: number | null;
}
