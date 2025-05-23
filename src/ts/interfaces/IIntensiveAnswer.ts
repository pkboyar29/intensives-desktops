import { IStudent } from './IStudent';
import { IIntensiveMark } from './IIntensiveMark';
import { IFile } from './IFile';

export interface IIntensiveAnswer {
  id: number;
  text: string;
  createdDate: Date;
  updatedDate: Date;
  files: IFile[];
  student: number; // возможность не имеет смысл хранить, так как в IIntensiveAnswerMark
}

export interface IIntensiveAnswerCreate {
  text: string;
  intensiveId: number;
}

export interface IIntensiveAnswerUpdate {
  text?: string;
  intensiveIds?: number[];
}

export interface IIntensiveAnswerMark {
  student: IStudent;
  intensiveAnswer: IIntensiveAnswer | null;
  intensiveMark: IIntensiveMark | null;
}
