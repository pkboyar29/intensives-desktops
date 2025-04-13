import { IUniversity } from './IUniversity';

export interface IBuilding {
  id: number;
  name: string;
  address: string;
  university: IUniversity;
}

export interface IBuildingCreate {
  name: string;
  address: string;
  university: number;
}

// DRY вариант от чат гпт export type IBuildingPatch = Partial<Omit<IBuildingUpdate, 'id'>> & { id: number };
export interface IBuildingPatch {
  id: number;
  name?: string;
  address?: string;
  university?: IUniversity;
  universityId?: number; // гибкость чтоб можно было передать с интерфейсом или просто id возможно понадобится везде
}
