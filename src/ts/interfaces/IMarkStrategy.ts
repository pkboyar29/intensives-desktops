export interface IMarkStrategy {
  id: number;
  name: string;
  lowBound: number;
  highBound: number;
}

export interface IMarkStrategyCreate {
  name: string;
  lowBound: number;
  highBound: number;
}

export interface IMarkStrategyPatch {
  id: number;
  name?: string;
  lowBound?: number;
  highBound?: number;
}
