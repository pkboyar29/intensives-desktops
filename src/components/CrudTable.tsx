import { FC, useState, useEffect, useMemo } from 'react';
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
import DisplaySelect from './common/DisplaySelect';
import { IUniversity } from '../ts/interfaces/IUniversity';

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

type WithId = { id: number };

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
  //console.log(data);
  const columns = tableConfigs[type] as ColumnConfig<T>[];

  const columnHelper = createColumnHelper<T>();

  const columnsTable: ColumnDef<T, any>[] = useMemo(() => {
    return columns.map((column) =>
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
            //if(typeof value === 'boolean') return 1

            /*
            switch (column.type) {
              case 'relation':
                return <ul>ku</ul>;
              default:
                return String(value ?? '');
            }
            */
            return value;
          },
        }
      )
    );
  }, []);

  columnsTable.push(
    columnHelper.display({
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => (
        <div className="space-x-1">
          <button
            onClick={() => handleEdit(row.original)}
            className="px-2 py-1 rounded hover:bg-gray_6"
          >
            ✏️
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="px-2 py-1 text-white rounded hover:bg-red"
          >
            🗑️
          </button>
        </div>
      ),
    })
  );

  if (childEntities && childEntities.length > 0) {
    console.log(childEntities);
    columnsTable.push(
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

  const table = useReactTable<T>({
    data,
    columns: columnsTable,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleEdit = (row: T) => {
    console.log('edit', row);
  };

  const handleDelete = (row: T) => {
    console.log('delet', row);
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
        <Table data={data} columns={columnsTable} />
      </div>
    </>
  );
}

export default CrudTable;
