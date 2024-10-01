import { IFlow } from './IFlow';
import { ITeacherOnIntensive } from './ITeacher';

export interface IIntensive {
  id: number;
  name: string;
  description: string;
  isOpen: boolean;
  open_dt: Date;
  close_dt: Date;
  flows: IFlow[];
  teachersTeam: ITeacherOnIntensive;
}

export interface IIntensiveCreate {
  name: string;
  description: string;
  open_dt: string;
  close_dt: string;
  teachers_command: number[];
  flow: number[];
}

export interface IIntensiveUpdate {
  id: number;
  name: string;
  description: string;
  open_dt: string;
  close_dt: string;
  teachers_command: number[];
  flow: number[];
}
