import { FC, useState } from 'react';
import SearchIcon from '../icons/SearchIcon';
import CrossIcon from '../icons/CrossIcon';
import { TableType } from '../../tableConfigs';
import { ColumnType } from '../../tableConfigs/nameConfig';

interface TableColumnHeaderProps {
  columnId: number | string;
  headerText: string;
  type: ColumnType;
  onChangeFilter?: (newValueFilter: string) => void;
}

const TableColumnHeader: FC<TableColumnHeaderProps> = ({
  columnId,
  headerText,
  type,
  onChangeFilter,
}) => {
  const [currentValue, setCurrentValue] = useState<string | undefined>();

  return (
    <div className="flex items-center">
      <div>{headerText}</div>
      {type === 'boolean' && (
        <select
          defaultValue={''}
          onChange={(e) => {
            setCurrentValue(e.target.value);
            onChangeFilter && onChangeFilter(e.target.value);
          }}
          className="w-6 border"
        >
          <option value=""></option>
          <option value="all">Все</option>
          <option value="true">Да</option>
          <option value="false">Нет</option>
        </select>
      )}

      {/* Под другие типы тоже можно рендерить разные фильтры */}
    </div>
  );
};

export default TableColumnHeader;
