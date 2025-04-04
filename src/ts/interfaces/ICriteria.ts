export interface ICriteria {
  id: number;
  name: string;
}

export interface ICriteriaCreate {
  name: string;
}

export interface ICriteriaPatch {
  id: number;
  name?: number;
}
