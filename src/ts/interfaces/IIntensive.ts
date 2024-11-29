import { IFlow } from './IFlow';
import { ITeacher } from './ITeacher';

// TODO: rename to openDate and closeDate

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
  universityId: number;
  isOpen: boolean;
}

export interface IIntensiveUpdate extends IIntensiveCreate {
  id: number;
}
