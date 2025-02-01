import { IStudent } from './IStudent';
import { ITeacher } from './ITeacher';

export interface ITeam {
  id: number | null;
  index: number;
  name: string;
  studentsInTeam: IStudent[];
  tutor: ITeacher | null;
  mentor: IStudent | null;
  teamlead: IStudent | null;
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
