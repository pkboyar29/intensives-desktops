import { IFile } from './IFile';
import { IFlow } from './IFlow';
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
  teachers: ITeacher[];
  roles: IStudentRole[];
  files: IFile[];
}

export interface IIntensiveCreate {
  name: string;
  description?: string;
  openDate: string;
  closeDate: string;
  teacherIds: number[];
  flowIds: number[];
  roleIds: number[];
  isOpen: boolean;
  fileIds?: number[]; // можно убрать
}

export interface IIntensiveUpdate extends IIntensiveCreate {
  id: number;
}

export interface IIntensiveUploadFiles {
  id: number;
  files: File | File[];
}
