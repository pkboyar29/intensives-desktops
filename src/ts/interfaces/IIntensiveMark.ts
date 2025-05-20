import { ITeacher } from './ITeacher';

export interface IIntensiveMark {
  id: number;
  mark: number;
  comment: string;
  teacher: ITeacher;
  student: number; // возможно не имеет смысл хранить, так как есть в IIntensiveAnswerMark
  createdDate: Date;
  updatedDate: Date;
}

export interface IIntensiveMarkCreate {
  mark: number;
  comment: string;
  student: number;
  teamId: number;
}

export interface IIntensiveMarkUpdate {
  id: number;
  mark: number;
  comment: string;
}
