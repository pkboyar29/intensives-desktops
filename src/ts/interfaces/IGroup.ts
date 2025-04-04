import { IProfile, ISpecialization } from './IEducation';
import { IFlow } from './IFlow';

export interface IGroup {
  id: number;
  name: string;
  flow: IFlow;
  profile?: IProfile;
  specialization?: ISpecialization;
}

export interface IGroupCreate {
  name: string;
  flow: number;
  profile?: number;
  specialization?: number;
}

export interface IGroupUpdate extends IGroupCreate {
  id: number;
}

export interface IGroupPatch {
  id: number;
  name?: string;
  flow?: number;
  profile?: number;
  specialization?: number;
}
