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
import RelatedKeysList from './RelatedKeysList';
import { IGroup } from '../ts/interfaces/IGroup';
import { ISpecialization } from '../ts/interfaces/IEducation';
import { validateTableFields } from '../helpers/tableHelpers';

interface CrudTableProps<T> {
  data: T[];
  type: TableType;
  getId: (row: T) => string | number;
  childEntities?: childEntitiesMeta[];
  onUpdate?: (item: T) => void;
  onDelete?: (item: T) => void;
  onChildNavigate?: (item: T, childEntities: childEntitiesMeta) => void;
  onChildNavigatePath?: (childNavigatePath: string) => void;
  isLoadingData?: boolean;
}

function CrudTable<T>(props: CrudTableProps<T>) {
  const {
    data,
    type,
    getId,
    childEntities,
    onUpdate,
    onDelete,
    onChildNavigate,
    onChildNavigatePath,
    isLoadingData,
  } = props;
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const editingRow = useRef<T | null>(null);
  const columns = tableConfigs[type] as ColumnConfig<T>[];
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});
  const dropdownRef = useRef<HTMLDivElement>(null); // Ссылка на кнопку меню

  const columnHelper = createColumnHelper<T>();

  useEffect(() => {
    //console.log(editingRow);
  }, [editingRow]);

  const columnsTable: ColumnDef<T, any>[] = useMemo(() => {
    const cols: ColumnDef<T, any>[] = columns.map((column) =>
      columnHelper.accessor(
        (row) => {
          if (column.key === 'id') {
            //setColumnVisibility({ [column.key]: false });
          }

          const value = row[column.key];
          if (
            //разные почти бесполезные проверки
            typeof value === 'object' &&
            value !== null &&
            column.type === 'relation' &&
            column.renderKey
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
            const key = info.column.id; // id столбца (равно названию поля данных)

            // isEditing по id, так как сравнение обычное вернет false сразу при редактировании
            const isEditing =
              editingRow.current &&
              getId(info.row.original) === getId(editingRow.current);

            // Если не режим редактирования или столбец только для чтения
            if (!isEditing || column.readOnly) {
              if (column.type === 'boolean' && column.key !== 'resetPassword') {
                return (
                  <input
                    type="checkbox"
                    defaultChecked={value ? value : false}
                    className="border border-black"
                    disabled
                  ></input>
                );
              }

              if (
                value === null ||
                value === undefined ||
                column.key === 'resetPassword'
              )
                return '—';
              return value;
            }

            // Иначе отображаем вместо значения редактируемое что-то
            switch (column.type) {
              case 'string':
                //if(column.key === "password") {
                //  return (<) //можно и как string а там при отправке запроса обработать как boolean или еще что то
                //}
                return (
                  <input
                    defaultValue={value}
                    //value={(editingRow[key as keyof T] as string) ?? ''}
                    className="border border-black"
                    onChange={(e) => {
                      if (editingRow.current) {
                        editingRow.current = {
                          ...editingRow.current,
                          [key as keyof T]: e.target.value,
                        };
                      }
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
              case 'boolean':
                return (
                  <div className="flex space-x-2">
                    {column.key === 'resetPassword' && (
                      <p className="">Сброс пароля</p>
                    )}
                    <input
                      type="checkbox"
                      defaultChecked={value ? value : false}
                      className="border border-black"
                      onChange={(e) => {
                        if (editingRow.current) {
                          editingRow.current = {
                            ...editingRow.current,
                            [key as keyof T]: e.target.checked,
                          };
                        }
                      }}
                    ></input>
                  </div>
                );
              case 'date': // тоже проверить (и доделать)
                return (
                  <input
                    type="date"
                    defaultValue={value}
                    className="border border-black"
                  ></input>
                );
              case 'relation':
                return (
                  <>
                    <RelatedKeysList
                      entity={type}
                      entityId={getId(info.row.original)}
                      entityParentId={
                        //проблема с замыканием изначального значения при первой отрисовке.
                        editingRow.current &&
                        column.parentField &&
                        (editingRow.current[column.parentField] as any).id // any плохо но id есть у всех сущностей (надо это где то прописать ведь это всегда так)
                      }
                      parent={
                        column.adaptedKeyName
                          ? column.adaptedKeyName
                          : column.key.toString()
                      }
                      defaultValue={value}
                      onChange={(parentEntity) => {
                        console.log(parentEntity?.id, parentEntity?.name);
                        if (editingRow.current) {
                          editingRow.current = {
                            ...editingRow.current,
                            [key as keyof T]: parentEntity
                              ? {
                                  id: parentEntity.id,
                                  [column.renderKey as string]:
                                    parentEntity.name,
                                }
                              : undefined,
                          };
                        }
                      }}
                    />
                  </>
                );
              default:
                return String(value ?? '');
            }
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
  }, [childEntities, editingRowId]);

  const handleSaveEditing = () => {
    //так как здесь замыкание можно сравнивать row в параметре и editingRow не являются ли они одинаковыми (но это будет нечитабельно)
    if (
      editingRow.current &&
      validateTableFields<T>(columns, editingRow.current)
    ) {
      onUpdate && onUpdate(editingRow.current);
      setEditingRowId(null);
      editingRow.current = null;
    }
  };

  const handleEdit = (row: T) => {
    const id = getId(row);
    const editingId = editingRow.current && getId(editingRow.current);
    setEditingRowId(editingId === id ? null : id.toString());
    editingRow.current = editingId === id ? null : row;
    //editingRow.current = { id: id } as any;
  };

  const handleDelete = (row: T) => {
    onDelete && onDelete(row);
  };

  const handleChildNavigate = (row: T, child: childEntitiesMeta) => {
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
          columnVisibility={columnVisibility}
        />
        {data.length === 0 && (
          <p className="mt-3 text-2xl text-center">
            {isLoadingData ? 'Загрузка...' : 'Нет записей'}
          </p>
        )}
      </div>
    </>
  );
}

export default CrudTable;
