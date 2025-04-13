import { FC, useState, useEffect, useMemo, useRef } from 'react';
import { childEntitiesMeta } from '../ts/types/types';
import { ColumnConfig } from '../tableConfigs/nameConfig';
import Table from './common/Table';
import {
  createColumnHelper,
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  Row,
} from '@tanstack/react-table';
import { tableConfigs, TableType } from '../tableConfigs';

interface CrudTableProps<T> {
  data: T[];
  type: TableType;
  childEntities?: childEntitiesMeta[];
  onCreate?: () => void;
  onUpdate?: (item: T) => void;
  onDelete?: (item: T) => void;
  onChildNavigate?: (item: T, childEntities: childEntitiesMeta) => void;
  onChildNavigatePath?: (childNavigatePath: string) => void;
  onNextPage?: () => void;
  getId: (row: T) => string | number;
}

function CrudTable<T>(props: CrudTableProps<T>) {
  const {
    data,
    type,
    getId,
    childEntities,
    onCreate,
    onUpdate,
    onDelete,
    onChildNavigate,
    onChildNavigatePath,
    onNextPage,
  } = props;
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  //const [editingRow, setEditingRow] = useState<T | null>(null);
  const editingRow = useRef<T | null>(null);
  const columns = tableConfigs[type] as ColumnConfig<T>[];

  const columnHelper = createColumnHelper<T>();

  useEffect(() => {
    console.log(editingRow);
  }, [editingRow]);

  useEffect(() => {
    if (!editingRowId) {
      //console.log('id is null ', editingRow);
    }
  }, [editingRowId]);

  const columnsTable: ColumnDef<T, any>[] = useMemo(() => {
    const cols: ColumnDef<T, any>[] = columns.map((column) =>
      columnHelper.accessor(
        (row) => {
          const value = row[column.key];
          //console.log(value);
          //console.log(column);
          //console.log(row);
          if (
            //разные почти бесполезные проверки
            column.renderKey &&
            typeof value === 'object' &&
            value !== null &&
            column.type === 'relation'
          ) {
            const nested = value as Record<string, any>;
            return nested[column.renderKey];
          }
          return value;
        },
        {
          id: String(column.key),
          header: column.label,
          cell: (info) => {
            // Кастомный рендер ячейки
            const value = info.getValue();

            if (value === null || value === undefined) return '—';

            const key = info.column.id; // id столбца (равно названию поля данных)
            // isEditing по id, так как сравнение обычное вернет false сразу при редактировании
            const isEditing =
              editingRow.current &&
              getId(info.row.original) === getId(editingRow.current);

            // Если не режим редактирования или столбец только для чтения
            if (!isEditing || column.readOnly) {
              return value;
            }

            // Иначе отображаем вместо значения редактируемое что-то
            switch (column.type) {
              case 'string':
                return (
                  <input
                    defaultValue={value}
                    //value={(editingRow[key as keyof T] as string) ?? ''} с этим тоже баги какие
                    className="border border-black"
                    onChange={(e) => {
                      if (editingRow.current) {
                        editingRow.current = {
                          ...editingRow.current,
                          [key as keyof T]: e.target.value,
                        };
                      }
                      /*
                      setEditingRow((prev) =>
                        prev
                          ? { ...prev, [key as keyof T]: e.target.value }
                          : prev
                      );
                      */
                    }}
                  ></input>
                );
              case 'number':
                return (
                  <input
                    defaultValue={value}
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="border border-black"
                  ></input>
                );
              case 'boolean': // проверить что будет ведь boolean нет вобще
                return <input type="checkbox" defaultChecked={value}></input>;
              case 'date': // тоже проверить
                return <input type="date" defaultValue={value}></input>;
              case 'relation':
                return <p>Прикол</p>;
              default:
                return String(value ?? '');
            }

            return value;
          },
        }
      )
    );

    cols.push(
      columnHelper.display({
        id: 'actions',
        header: 'Действия',
        cell: ({ row }) => {
          const isEditing =
            editingRow.current &&
            getId(row.original) === getId(editingRow.current);

          return (
            <div className="space-x-1">
              <button
                onClick={() =>
                  isEditing ? handleSaveEditing() : handleEdit(row.original)
                }
                className="px-2 py-1 rounded hover:bg-gray_6"
                title={
                  isEditing ? 'Сохранить изменения' : 'Редактировать запись'
                }
              >
                {isEditing ? '💾' : '✏️'}
              </button>
              <button
                onClick={() =>
                  isEditing
                    ? handleEdit(row.original)
                    : handleDelete(row.original)
                }
                className={`px-2 py-1 text-white rounded ${
                  isEditing ? 'hover:bg-gray_6' : 'hover:bg-red'
                }`}
                title={isEditing ? 'Отменить редактирование' : 'Удалить запись'}
              >
                {isEditing ? '❌' : '🗑️'}
              </button>
            </div>
          );
        },
      })
    );

    if (childEntities && childEntities.length > 0) {
      //console.log(childEntities);
      cols.push(
        columnHelper.display({
          id: 'childEntities',
          header: 'Перейти к',
          cell: ({ row }) => (
            <ul>
              {childEntities.map((child) => (
                <li key={child.type}>
                  <button
                    onClick={() => handleChildNavigate(row.original, child)}
                    className="hover:text-blue"
                    title={`Перейти к ${child.label}`}
                  >
                    {child.label}
                  </button>
                </li>
              ))}
            </ul>
          ),
        })
      );
    }

    return cols;
  }, [childEntities, editingRowId]); //что то придумать

  const handleSaveEditing = () => {
    // был параметр T
    //console.log(editedRow);
    //console.log(editingRow);
    //setEditingRow(null);
    console.log(editingRow.current);
    editingRow.current && onUpdate && onUpdate(editingRow.current);
    setEditingRowId(null);
    editingRow.current = null;
  };

  const handleEdit = (row: T) => {
    console.log('edit', row);
    const id = getId(row);
    const editingId = editingRow.current && getId(editingRow.current);
    //console.log(editingRow && getId(editingRow));
    setEditingRowId(editingId === id ? null : id.toString());
    editingRow.current = editingId === id ? null : row;
  };

  const handleDelete = (row: T) => {
    console.log('delet', row);
    onDelete && onDelete(row);
  };

  const handleChildNavigate = (row: T, child: childEntitiesMeta) => {
    //console.log(child, row);
    if (onChildNavigatePath) {
      const path = '/' + getId(row) + '/' + child.type;
      onChildNavigatePath(path);
    }
  };

  return (
    <>
      <div>
        <Table
          data={data}
          columns={columnsTable}
          pagination={onNextPage ? { onNextPage: () => onNextPage } : undefined}
        />
      </div>
      <button onClick={() => console.log(editingRow)}>
        чекнуть редактируемую строку
      </button>
    </>
  );
}

export default CrudTable;
