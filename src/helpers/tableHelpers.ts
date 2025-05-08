import { toast } from 'react-toastify';
import { ColumnConfig } from '../tableConfigs/nameConfig';

export function validateTableFields<T>(
  columns: ColumnConfig<T>[],
  row: T
): boolean {
  var i = 0;
  columns.forEach((column) => {
    if (!row[column.key] && !column.isNull && !column.readOnly) {
      toast(`Поле "${column.label}" обязательное`, {
        type: 'warning',
      });
      i++;
    }
  });

  if (i > 0) return false;
  else return true;
}
