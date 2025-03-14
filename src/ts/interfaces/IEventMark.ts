import { ICriteria } from './ICriteria';
import { ITeacher } from './ITeacher';

export interface IEventMark {
  id: number;
  mark: number;
  criteria?: ICriteria;
  comment: string;
  createdDate: Date;
  updatedDate: Date;
  teacher: ITeacher;
  eventAnswerId: number;
}

export interface IEventMarkAvg {
  criteria?: ICriteria;
  avgMark: number;
}

export interface IEventMarkCreate {
  mark: number;
  criteria: number | null;
  comment: string;
}

export interface IEventMarksCreate {
  eventAnswerId: number;
  marksToCreate: IEventMarkCreate[];
}

export interface IEventMarkUpdate {
  eventMarkId: number;
  mark: number;
  comment: string;
}
