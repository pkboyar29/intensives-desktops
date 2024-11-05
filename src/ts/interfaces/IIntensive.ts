import { IFlow } from './IFlow';
import { ITeacherOnIntensive } from './ITeacher';

// TODO: rename to openDate and closeDate

export interface IIntensive {
  id: number;
  name: string;
  description: string;
  isOpen: boolean;
  open_dt: Date;
  close_dt: Date;
  flows: IFlow[];
  teachersTeam: ITeacherOnIntensive[];
}

export interface IIntensiveCreate {
  name: string;
  description: string;
  open_dt: string;
  close_dt: string;
  teacher_team: number[];
  flows: number[];
}

export interface IIntensiveUpdate {
  id: number;
  name: string;
  description: string;
  open_dt: string;
  close_dt: string;
  teacher_team: number[];
  flows: number[];
}
