import { IEventMark } from './IEventMark';
import { IFile } from './IFile';
import { IStudent } from './IStudent';
import { ITeam } from './ITeam';

export interface IEventAnswer {
  id: number;
  text: string;
  student: IStudent;
  team: ITeam;
  createdDt: Date;
  files: IFile[];
  marks: IEventMark[];
  hasMarks?: boolean;
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
