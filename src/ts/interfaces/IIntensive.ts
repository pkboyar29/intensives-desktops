import { IFile } from './IFile';
import { IFlow } from './IFlow';
import { IStudent } from './IStudent';
import { IStudentRole } from './IStudentRole';
import { ITeacher } from './ITeacher';

export interface IIntensive {
  id: number;
  name: string;
  description?: string;
  isOpen: boolean;
  openDate: Date;
  closeDate: Date;
  flows: IFlow[];
  specificStudents: IStudent[];
  teachers: ITeacher[];
  managers: ITeacher[];
  creatorId: number;
  roles: IStudentRole[];
  files: IFile[];
}

export interface IIntensiveShort {
  id: number;
  name: string;
  description?: string;
  isOpen: boolean;
  openDate: Date;
  closeDate: Date;
  flows: IFlow[];
  teachers: number[];
}

export interface IIntensiveCreate {
  name: string;
  description?: string;
  openDate: string;
  closeDate: string;
  teacherIds: number[];
  managerIds: number[];
  flowIds: number[];
  specificStudentsIds: number[];
  roleIds: number[];
  isOpen: boolean;
  fileIds?: number[]; // можно перенести в IIntensiveUpdate
}

export interface IIntensiveUpdate extends IIntensiveCreate {
  id: number;
}
