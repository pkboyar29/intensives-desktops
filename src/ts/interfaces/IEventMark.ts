import { ITeacher } from './ITeacher';

export interface IEventMark {
  id: number;
  mark: number;
  criteria?: number;
  comment: string;
  createdDate: Date;
  teacher: ITeacher;
  eventAnswerId: number;
}

export interface IEventMarkCreate {
  mark: number;
  criteria: number | null;
  comment: string;
  eventAnswerId: number;
}

export interface IEventMarkUpdate extends IEventMarkCreate {
  eventMarkId: number;
}
