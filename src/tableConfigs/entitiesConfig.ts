import { useLazyGetAudiencesQuery } from '../redux/api/audienceApi';
import {
  useCreateBuildingMutation,
  useDeleteBuildingMutation,
  useLazyGetBuildingsQuery,
  useUpdateBuildingMutation,
} from '../redux/api/buildingApi';
import {
  useCreateUniversityMutation,
  useDeleteUniversityMutation,
  useLazyGetUniversitiesQuery,
  useUpdateUniversityMutation,
} from '../redux/api/universityApi';
import { TableType, tableConfigs } from '.';
import { useLazyGetFlowsQuery } from '../redux/api/flowApi';
import { useLazyGetGroupsQuery } from '../redux/api/groupApi';
import { useLazyGetEducationQuery } from '../redux/api/educationApi';
import { EntitiesQueryHooks, queryHooksMap } from './queryHooksConfig';

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
  hooks: EntitiesQueryHooks;
};

export const entitiesConfig: Record<string, EntitiesConfig> = {
  universities: {
    type: 'universities',
    title: 'Университеты',
    defaultQueryParams: { withChildrenMeta: true },
    hooks: queryHooksMap['universities'],
  },
  buildings: {
    type: 'buildings',
    title: 'Корпуса',
    queryParamsDependencies: [{ from: 'universityId', as: 'university' }],
    defaultQueryParams: { withChildrenMeta: true },
    hooks: queryHooksMap['buildings'],
  },
  audiences: {
    type: 'audiences',
    title: 'Аудитории',
    queryParamsDependencies: [{ from: 'buildingId', as: 'buildings' }],
    hooks: queryHooksMap['audiences'],
  },
  flows: {
    type: 'flows',
    title: 'Потоки',
    queryParamsDependencies: [{ from: 'universityId', as: 'universities' }],
    defaultQueryParams: { withChildrenMeta: true },
    hooks: queryHooksMap['flows'],
  },
  groups: {
    type: 'groups',
    title: 'Группы',
    queryParamsDependencies: [{ from: 'flowId', as: 'flows' }],
    defaultQueryParams: { withChildrenMeta: true },
    hooks: queryHooksMap['groups'],
  },
  stagesEducation: {
    type: 'stagesEducation',
    title: 'Ступени образования',
    defaultQueryParams: { type: 'stages_education' },
    hooks: queryHooksMap['education'],
  },
  profiles: {
    type: 'profiles',
    title: 'Профили',
    defaultQueryParams: { type: 'profiles' },
    hooks: queryHooksMap['education'],
  },
  specializations: {
    type: 'specializations',
    title: 'Направления образования',
    defaultQueryParams: { type: 'specializations' },
    hooks: queryHooksMap['education'],
  },
};

export function useEntityQueryHooks<
  T extends TableType,
  A extends keyof EntitiesQueryHooks
>(type: T, action: A): EntitiesConfig['hooks'][A] {
  return entitiesConfig[type].hooks[action];
}
