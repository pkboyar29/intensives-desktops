import { IFlow } from './IFlow';
import { ITeacher } from './ITeacher';

export interface IIntensive {
  id: number;
  name: string;
  description: string;
  isOpen: boolean;
  openDate: Date;
  closeDate: Date;
  flows: IFlow[];
  teachers: ITeacher[];
}

export interface IIntensiveCreate {
  name: string;
  description: string;
  openDate: string;
  closeDate: string;
  teacherIds: number[];
  flowIds: number[];
  roleIds: number[];
  isOpen: boolean;
}

export interface IIntensiveUpdate extends IIntensiveCreate {
  id: number;
}
