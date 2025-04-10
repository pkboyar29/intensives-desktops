import { IAudience } from '../ts/interfaces/IAudience';
import { IBuilding } from '../ts/interfaces/IBuilding';
import {
  IProfile,
  ISpecialization,
  IStageEducation,
} from '../ts/interfaces/IEducation';
import { IFlow } from '../ts/interfaces/IFlow';
import { IGroup } from '../ts/interfaces/IGroup';
import { IUniversity } from '../ts/interfaces/IUniversity';
import {
  audienceColumns,
  buildingColumns,
  ColumnConfig,
  flowsColumns,
  groupsColumns,
  profilesColumns,
  specializationsColumns,
  stagesEducationColumns,
  universityColumns,
} from './nameConfig';

export type TableType = keyof typeof tableConfigs; // тип на все ключи в tableConfigs

type TableConfigMap = {
  universities: ColumnConfig<IUniversity>[];
  buildings: ColumnConfig<IBuilding>[];
  audiences: ColumnConfig<IAudience>[];
  flows: ColumnConfig<IFlow>[];
  groups: ColumnConfig<IGroup>[];
  stagesEducation: ColumnConfig<IStageEducation>[];
  profiles: ColumnConfig<IProfile>[];
  specializations: ColumnConfig<ISpecialization>[];
};

export const tableConfigs: TableConfigMap = {
  universities: universityColumns,
  buildings: buildingColumns,
  audiences: audienceColumns,
  flows: flowsColumns,
  groups: groupsColumns,
  stagesEducation: stagesEducationColumns,
  profiles: profilesColumns,
  specializations: specializationsColumns,
};
