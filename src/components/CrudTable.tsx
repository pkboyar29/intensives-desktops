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

interface CrudTableProps<T> {
  data: T[];
  type: TableType;
  //columns: ColumnConfig<T>[];
  childEntities?: childEntitiesMeta[];
  onCreate?: () => void;
  onUpdate?: (item: T) => void;
  onDelete?: (item: T) => void;
  onChildNavigate?: (item: T, childEntities: childEntitiesMeta) => void;
  onChildNavigatePath?: (childNavigatePath: string) => void;
  onNextPage?: () => void;
}

type WithId = { id: number };

function CrudTable<T extends WithId>(props: CrudTableProps<T>) {
  const {
    data,
    type,
    //columns,
    childEntities,
    onCreate,
    onUpdate,
    onDelete,
    onChildNavigate,
    onChildNavigatePath,
    onNextPage,
  } = props;
  console.log(data);
  const columns = tableConfigs[type];

  const columnHelper = createColumnHelper<T>();

  const columnsTable: ColumnDef<T, any>[] = useMemo(() => {
    return columns.map((column) =>
      columnHelper.accessor(column.key.toString() as any, {
        header: () => column.label,
      })
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
            className="px-2 py-1 rounded bg-blue hover:bg-dark_blue"
          >
            ✏️
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="px-2 py-1 text-white rounded bg-red hover:bg-dark_red"
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
    console.log(child, row);
    if (onChildNavigatePath) {
      const path = '/' + row.id + '/' + child.type;
      onChildNavigatePath(path);
    }
  };

  return (
    <>
      <div>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <Table data={data} columns={columnsTable} />
      </div>
    </>
  );
}

export default CrudTable;
