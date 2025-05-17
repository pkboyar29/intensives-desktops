import { IStudent } from './IStudent';
import { IIntensiveMark } from './IIntensiveMark';

export interface IIntensiveAnswer {
  id: number;
  text: string;
  createdDate: Date;
  updatedDate: Date;
  student: number; // возможность не имеет смысл хранить, так как в IIntensiveAnswerMark
}

export interface IIntensiveAnswerMark {
  student: IStudent;
  intensiveAnswer: IIntensiveAnswer | null;
  intensiveMark: IIntensiveMark | null;
}
