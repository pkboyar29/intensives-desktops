import { useLazyGetAudiencesQuery } from '../redux/api/audienceApi';
import { useLazyGetBuildingsQuery } from '../redux/api/buildingApi';
import { useLazyGetUniversitiesQuery } from '../redux/api/universityApi';
import { TableType, tableConfigs } from '.';
import { useLazyGetFlowsQuery } from '../redux/api/flowApi';

// Тип описания query параметров родительской сущности у дочерней сущности
type QueryParamDependencies = {
  from: string; // имя параметра в URL, например universityId
  as: string; // имя параметра query например universities
};

type EntitiesConfig = {
  type: TableType;
  title: string;
  queryParamsDependencies?: QueryParamDependencies[];
  defaultQueryParams?: Record<string, any>;
};

export const entitiesConfig: Record<string, EntitiesConfig> = {
  universities: {
    type: 'universities',
    title: 'Университеты',
    defaultQueryParams: { withChildrenMeta: true },
  },
  buildings: {
    type: 'buildings',
    title: 'Корпуса',
    queryParamsDependencies: [{ from: 'universityId', as: 'universities' }],
    defaultQueryParams: { withChildrenMeta: true },
  },
  audiences: {
    type: 'audiences',
    title: 'Аудитории',
    queryParamsDependencies: [{ from: 'buildingId', as: 'buildings' }],
  },
  flows: {
    type: 'flows',
    title: 'Потоки',
    queryParamsDependencies: [{ from: 'universityId', as: 'universities' }],
    defaultQueryParams: { withChildrenMeta: true },
  },
};

export const useEntityQueryHook = (type: string) => {
  switch (type) {
    case 'universities':
      return useLazyGetUniversitiesQuery();
    case 'buildings':
      return useLazyGetBuildingsQuery();
    case 'audiences':
      return useLazyGetAudiencesQuery();
    case 'flows':
      return useLazyGetFlowsQuery();
    default:
      throw new Error('Unknown entity type');
  }
};
