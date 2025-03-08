import { ITeacher } from './ITeacher';

export interface IEventMark {
  id: number;
  mark: number;
  criteria?: number;
  comment: string;
  createdDate: Date;
  updatedDate: Date;
  teacher: ITeacher;
  eventAnswerId: number;
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
