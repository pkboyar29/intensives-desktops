import { IFile } from './IFile';
import { IStudent } from './IStudent';

export interface IEventAnswer {
  id: number;
  text: string;
  student: IStudent;
  createdDt: Date;
  files: IFile[];
}

export interface IEventAnswerShort {
  id: number;
  createdDt: Date;
  hasMarks: boolean;
}

export interface IEventAnswerCreate {
  event: number;
  text: string;
  team?: number;
}

export interface IEventAnswerUpdate {
  id: number;
  text: string;
  fileIds?: number[];
}
