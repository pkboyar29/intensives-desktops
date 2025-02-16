import { IFile } from './IFile';
import { IStudent } from './IStudent';

export interface IEvenetAnswer {
  id: number;
  text: string;
  student: IStudent;
  createdDt: Date;
  files: IFile[];
}

export interface IEvenetAnswerCreate {
  event: number;
  text: string;
  team?: number;
}
