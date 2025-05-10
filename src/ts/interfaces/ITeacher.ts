import { IUniversity } from './IUniversity';
import { IUserAdmin } from './IUser';

export interface ITeacher {
  id: number;
  name: string;
}

export interface ITeacherAdmin extends IUserAdmin {
  university: IUniversity;
  isActive: boolean;
}
