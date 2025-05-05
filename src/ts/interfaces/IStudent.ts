import { IFlow } from './IFlow';
import { IGroup } from './IGroup';
import { IUser, IUserAdmin } from './IUser';

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
