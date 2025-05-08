import { IStageEducation } from './IEducation';
import { IUniversity } from './IUniversity';

export interface IFlow {
  id: number;
  name: string;
  university: IUniversity;
  stageEducation: IStageEducation;
  graduationDate: Date;
}

export interface IFlowCreate {
  name: string;
  university: number;
  stageEducation: number;
}

export interface IFlowUpdate extends IFlowCreate {
  id: number;
}

export interface IFlowPatch {
  id: number;
  name?: string;
  university?: IUniversity;
  stageEducation?: IStageEducation;
}
