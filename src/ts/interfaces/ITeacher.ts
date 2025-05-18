import { IUniversity } from './IUniversity';
import { IUserAdmin, IUserPatch, IUserRegister } from './IUser';

export interface ITeacher {
  id: number;
  name: string;
  user: {
    firstName: string;
    lastName: string;
    patronymic: string;
  };
}

export interface ITeacherAdmin extends IUserAdmin {
  university: IUniversity;
  isActive: boolean;
  isManager: boolean;
}

export interface ITeacherRegister extends IUserRegister {
  university: IUniversity;
  isManager: boolean;
}

export interface ITeacherPatch extends IUserPatch {
  university?: IUniversity;
  isManager?: boolean;
}
