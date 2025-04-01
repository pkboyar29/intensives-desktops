import { IUniversity } from '../ts/interfaces/IUniversity';

// Тип для метаданных интерфейсов для таблицы
export type ColumnConfig<T> = {
  key: keyof T;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date';
};

// Набор метаданных (можно вроде автоматически вычислять)
export const universityColumns: ColumnConfig<IUniversity>[] = [
  { key: 'id', label: 'ID', type: 'number' },
  { key: 'name', label: 'Название', type: 'string' },
];
