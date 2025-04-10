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

// Тип для метаданных интерфейсов для таблицы
export type ColumnConfig<T> = {
  key: keyof T;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'relation';
  renderKey?: string;
};

// Набор метаданных (можно вроде автоматически вычислять)

export const universityColumns: ColumnConfig<IUniversity>[] = [
  { key: 'id', label: 'ID', type: 'number' },
  { key: 'name', label: 'Название', type: 'string' },
];

export const buildingColumns: ColumnConfig<IBuilding>[] = [
  { key: 'id', label: 'ID', type: 'number' },
  { key: 'name', label: 'Название', type: 'string' },
  {
    key: 'university',
    label: 'Университет',
    type: 'relation',
    renderKey: 'name',
  },
  { key: 'address', label: 'Адрес', type: 'string' },
];

export const audienceColumns: ColumnConfig<IAudience>[] = [
  { key: 'id', label: 'ID', type: 'number' },
  { key: 'name', label: 'Название', type: 'string' },
  {
    key: 'building',
    label: 'Корпус',
    type: 'relation',
    renderKey: 'name',
  },
];

export const flowsColumns: ColumnConfig<IFlow>[] = [
  { key: 'id', label: 'ID', type: 'number' },
  { key: 'name', label: 'Название', type: 'string' },
  {
    key: 'university',
    label: 'Университет',
    type: 'relation',
    renderKey: 'name',
  },
  {
    key: 'stageEducation',
    label: 'Ступень',
    type: 'relation',
    renderKey: 'name',
  },
];

export const groupsColumns: ColumnConfig<IGroup>[] = [
  { key: 'id', label: 'ID', type: 'number' },
  { key: 'name', label: 'Название', type: 'string' },
  {
    key: 'flow',
    label: 'Поток',
    type: 'relation',
    renderKey: 'name',
  },
  {
    key: 'profile',
    label: 'Профиль',
    type: 'relation',
    renderKey: 'name',
  },
  {
    key: 'specialization',
    label: 'Специализация',
    type: 'relation',
    renderKey: 'name',
  },
];

export const stagesEducationColumns: ColumnConfig<IStageEducation>[] = [
  { key: 'id', label: 'ID', type: 'number' },
  { key: 'name', label: 'Название', type: 'string' },
];

export const profilesColumns: ColumnConfig<IProfile>[] = [
  { key: 'id', label: 'ID', type: 'number' },
  { key: 'name', label: 'Название', type: 'string' },
];

export const specializationsColumns: ColumnConfig<ISpecialization>[] = [
  { key: 'id', label: 'ID', type: 'number' },
  { key: 'name', label: 'Название', type: 'string' },
];
