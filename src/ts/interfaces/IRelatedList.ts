import { TableType } from '../../tableConfigs';

export interface IRelatedList {
  id: number;
  name: string;
}

export interface IParent {
  id: number;
  name: string;
  path: string;
}
