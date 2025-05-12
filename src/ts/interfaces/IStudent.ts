import { IFlow } from './IFlow';
import { IGroup } from './IGroup';
import { IUser, IUserAdmin, IUserPatch, IUserRegister } from './IUser';

export interface IStudent {
  id: number;
  group: {
    id: number;
    flowId: number;
  };
  nameWithGroup: string;
}

export interface IStudentAdmin extends IUserAdmin {
  group: IGroup;
  listed: boolean;
}

export interface IStudentRegister extends IUserRegister {
  group: number;
}

export interface IStudentPatch extends IUserPatch {
  group?: IGroup;
}
