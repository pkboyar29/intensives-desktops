import { IAudience } from '../ts/interfaces/IAudience';
import { IBuilding } from '../ts/interfaces/IBuilding';
import { IFlow } from '../ts/interfaces/IFlow';
import { IUniversity } from '../ts/interfaces/IUniversity';
import {
  audienceColumns,
  buildingColumns,
  ColumnConfig,
  flowsColumns,
  universityColumns,
} from './nameConfig';

export type TableType = keyof typeof tableConfigs; // тип на все ключи в tableConfigs

type TableConfigMap = {
  universities: ColumnConfig<IUniversity>[];
  buildings: ColumnConfig<IBuilding>[];
  audiences: ColumnConfig<IAudience>[];
  flows: ColumnConfig<IFlow>[];
};

export const tableConfigs: TableConfigMap = {
  universities: universityColumns,
  buildings: buildingColumns,
  audiences: audienceColumns,
  flows: flowsColumns,
};
