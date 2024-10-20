import { IStudent } from './IStudent';

// TODO: убрать тут null?
export interface ITeam {
  id: number;
  name: string;
  tutorId?: number | null;
  tutorNameSurname?: string | null;
  mentorId?: number | null;
  mentorNameSurname?: string | null;
  intensiveId: number;
}

export interface ITeamForManager {
  id: number | null;
  index: number;
  name: string;
  studentsInTeam: IStudent[];
  tutorId?: number;
  mentorId?: number;
  teamleadId?: number;
}

export interface ITeamToChoose {
  id: number;
  name: string;
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
