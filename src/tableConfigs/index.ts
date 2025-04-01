import { IUniversity } from '../ts/interfaces/IUniversity';
import { ColumnConfig, universityColumns } from './nameConfig';

export type TableType = keyof typeof tableConfigs; // тип на все ключи в tableConfigs

type TableConfigMap = {
  universities: ColumnConfig<IUniversity>[];
};

export const tableConfigs: TableConfigMap = {
  universities: universityColumns,
};

/* другой способ
export const tableConfigs = {
  university: universityColumns,
} satisfies Record<string, ColumnConfig<any>[]>;
*/
