import { IStudent } from './IStudent';
import { ITeacher, ITeacherOnIntensive } from './ITeacher';

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

// TODO: потом ITeam не будет нужен, и можно ITeamForManager переименовать на ITeam?
export interface ITeamForManager {
  id: number | null;
  index: number;
  name: string;
  studentsInTeam: IStudent[];
  tutor: ITeacherOnIntensive | null;
  mentor: IStudent | null;
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
