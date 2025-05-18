import { TableType } from '../../tableConfigs';

export interface IRelatedListResult {
  id: number | string;
  name: string;
}

export interface IRelatedList {
  results: IRelatedListResult[];
  //id: number;
  //name: string;
}

export interface IParentInfo {
  key: string;
  name: string;
}

export interface IKeyInfo {
  urlPath: string;
}

export interface IChildInfo {
  key: string;
}

export interface IRelatedListAdvanced {
  results: IRelatedListResult[];
  keyInfo: IKeyInfo;
  parentInfo?: IParentInfo;
  childInfo?: IChildInfo;
}
