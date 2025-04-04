import { IBuilding } from './IBuilding';

export interface IAudience {
  id: number;
  name: string;
  building: IBuilding;
}

export interface IAudienceCreate {
  name: string;
  bilding: number;
}

export interface IAudienceUpdate extends IAudienceCreate {
  id: number;
}

export interface IAudiencePatch {
  id: number;
  name?: string;
  building?: string;
}
