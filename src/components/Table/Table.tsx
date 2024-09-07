import { FC } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface TableProps {
  data: any[];
  columns: any[];
  onClick: (id: number) => void;
}

const Table: FC<TableProps> = ({ data, columns, onClick }) => {
  const table = useReactTable({
    data,
    columns,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;
  const lastRowIndex = rows.length - 1;

  return (
    <>
      <div className="inline-block w-full mt-8 rounded-lg">
        <table className="w-full">
          <thead className="bg-[#F1F5F9] border-b border-solid border-[#e5e7eb]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 font-sans font-semibold text-left rounded text-thead_cell"
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

          <tbody>
            {table.getRowModel().rows.map((row, rowIndex) => (
              <tr
                onClick={() =>
                  onClick(row.getAllCells()[0].getValue() as number)
                }
                key={row.id}
                className={`cursor-pointer ${
                  rowIndex !== lastRowIndex &&
                  `border-b border-solid border-[#e5e7eb]`
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-3 font-sans text-base font-normal text-black"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
