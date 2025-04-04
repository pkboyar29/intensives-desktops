import { IBuilding } from '../ts/interfaces/IBuilding';
import { IFlow } from '../ts/interfaces/IFlow';
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
