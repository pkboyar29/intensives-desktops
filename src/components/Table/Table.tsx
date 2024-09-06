import { FC } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface TableProps {
  data: any[];
  columns: any[];
  buttonText: string;
  onButtonClick: (id: number) => void;
}

const Table: FC<TableProps> = ({
  data,
  columns,
  buttonText,
  onButtonClick,
}) => {
  const table = useReactTable({
    data,
    columns,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="inline-block mt-8 border border-solid rounded-lg border-gray">
        <table className="">
          <thead className="bg-[#F1F5F9]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 font-sans font-semibold text-left border-2 border-white border-solid rounded text-thead_cell"
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

          <tbody className="">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-3 font-sans text-base font-normal text-black"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td>
                  <button
                    onClick={() =>
                      onButtonClick(row.getAllCells()[0].getValue() as number)
                    }
                    className="px-4 py-2 text-base font-semibold text-white bg-blue font-inter rounded-xl"
                  >
                    {buttonText}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
