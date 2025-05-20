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
    defaultQueryParams: { withChildrenMeta: true, ordering: 'name' },
    hooks: queryHooksMap['universities'],
  },
  buildings: {
    type: 'buildings',
    title: 'Корпуса',
    queryParamsDependencies: [{ from: 'universityId', as: 'university' }],
    defaultQueryParams: { withChildrenMeta: true, ordering: 'name' },
    hooks: queryHooksMap['buildings'],
  },
  audiences: {
    type: 'audiences',
    title: 'Аудитории',
    queryParamsDependencies: [{ from: 'buildingId', as: 'building' }],
    hooks: queryHooksMap['audiences'],
  },
  flows: {
    type: 'flows',
    title: 'Потоки',
    queryParamsDependencies: [
      { from: 'universityId', as: 'university' },
      { from: 'isArchived', as: 'archived' },
    ],
    defaultQueryParams: { withChildrenMeta: true, ordering: 'name' },
    hooks: queryHooksMap['flows'],
  },
  groups: {
    type: 'groups',
    title: 'Группы',
    queryParamsDependencies: [{ from: 'flowId', as: 'flow' }],
    defaultQueryParams: { withChildrenMeta: true, ordering: 'name' },
    hooks: queryHooksMap['groups'],
  },
  stagesEducation: {
    type: 'stagesEducation',
    title: 'Ступени образования',
    defaultQueryParams: { type: 'stages_education', ordering: 'name' },
    hooks: queryHooksMap['education'],
  },
  profiles: {
    type: 'profiles',
    title: 'Профили',
    //queryParamsDependencies: [{ from: 'specializationId', as: 'specialization' }],
    defaultQueryParams: { type: 'profiles', ordering: 'name' },
    hooks: queryHooksMap['education'],
  },
  specializations: {
    type: 'specializations',
    title: 'Направления образования',
    defaultQueryParams: { type: 'specializations', ordering: 'name' },
    hooks: queryHooksMap['education'],
  },
  students: {
    type: 'students',
    title: 'Студенты',
    queryParamsDependencies: [{ from: 'groupId', as: 'group' }],
    defaultQueryParams: { ordering: 'last_name' },
    hooks: queryHooksMap['students'],
  },
  teachers: {
    type: 'teachers',
    title: 'Преподаватели',
    queryParamsDependencies: [
      { from: 'universityId', as: 'university' },
      { from: 'isManager', as: 'is_manager' },
    ],
    defaultQueryParams: { ordering: 'last_name' },
    hooks: queryHooksMap['teachers'],
  },
  markStrategies: {
    type: 'markStrategies',
    title: 'Шкалы оценки',
    defaultQueryParams: { ordering: 'name' },
    hooks: queryHooksMap['markStrategy'],
  },
  studentRoles: {
    type: 'studentRoles',
    title: 'Роли студента',
    defaultQueryParams: { ordering: 'name' },
    hooks: queryHooksMap['studentRoles'],
  },
  criterias: {
    type: 'criterias',
    title: 'Критерии оценивания',
    defaultQueryParams: { ordering: 'name' },
    hooks: queryHooksMap['criterias'],
  },
};

export function useEntityQueryHooks<
  T extends TableType,
  A extends keyof EntitiesQueryHooks
>(type: T, action: A): EntitiesConfig['hooks'][A] {
  return entitiesConfig[type].hooks[action];
}
