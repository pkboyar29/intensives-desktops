import { ITeacher } from './ITeacher';

export interface IEventMark {
  id: number;
  mark: number;
  criteria: string;
  comment: string;
  createdDt: Date;
  teacher: ITeacher;
}
