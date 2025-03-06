import { IEventAnswer } from './IEventAnswer';
import { ITeacher } from './ITeacher';

export interface IEventMark {
  id: number;
  mark: number;
  criteria?: string;
  comment: string;
  createdDate: Date;
  teacher: ITeacher;
  eventAnswer: IEventAnswer;
}

export interface IEventMarkCreate {
  mark: number;
  criteria?: number;
  comment: string;
  eventAnswerId: number;
}

export interface IEventMarkUpdate extends IEventMarkCreate {
  eventMarkId: number;
}
