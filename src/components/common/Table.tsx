import { FC, useState, useEffect, useRef } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import PagionationButtonPages from '../PaginationButtonPages';

interface TableProps {
  data: any[];
  columns: any[];
  onClick?: (id: number) => void;
  columnVisibility?: Record<string, boolean>;
}

const Table: FC<TableProps> = ({
  data,
  columns,
  onClick,
  columnVisibility = {},
}) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 50, //default page size
  });

  const table = useReactTable({
    data,
    columns,
    debugTable: false,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
      // columnVisibility, //с этим получается задержка
    },
    initialState: {
      columnVisibility: {
        id: false,
      },
    },
  });

  const rows = table.getRowModel().rows;
  const lastRowIndex = rows.length - 1;

  return (
    <>
      <div className="inline-block w-full mt-6 overflow-x-auto border rounded-lg border-neutral-300">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="border-b bg-gray_8 border-gray_9">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 font-sans font-semibold text-left rounded text-black_2"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
          </table>
        </div>
        <div
          className="overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 23rem)' }}
        >
          <table className="w-full table-fixed">
            <tbody>
              {table.getRowModel().rows.map((row, rowIndex) => (
                <tr
                  onClick={() =>
                    onClick &&
                    onClick(row.getAllCells()[0].getValue() as number)
                  }
                  key={row.id}
                  className={`hover:bg-gray_8 transition duration-300 ease-in-out ${
                    rowIndex !== lastRowIndex &&
                    `border-b border-solid border-gray_9`
                  } ${onClick && `cursor-pointer`}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-3 font-sans text-base font-normal text-black"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {table.getCanPreviousPage() ? '❮' : ''}
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {table.getCanNextPage() ? '❯' : ''}
        </button>
      </div>
    </>
  );
};

export default Table;
