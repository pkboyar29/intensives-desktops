import { FC } from 'react'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

interface TableProps {
   data: any[],
   columns: any[],
   buttonText: string,
   onButtonClick: (id: number) => void
}

const Table: FC<TableProps> = ({ data, columns, buttonText, onButtonClick }) => {
   const table = useReactTable({
      data,
      columns,
      debugTable: true,
      getCoreRowModel: getCoreRowModel()
   })

   return (
      <>
         <div className='inline-block rounded-lg border border-gray border-solid mt-8'>
            <table className=''>
               <thead className='bg-[#F1F5F9]'>
                  {table.getHeaderGroups().map((headerGroup) => (
                     <tr key={headerGroup.id} className=''>
                        {headerGroup.headers.map((header) => (
                           <th key={header.id} className='text-left text-thead_cell font-sans font-semibold px-6 py-3 rounded border-2 border-white border-solid' >{flexRender(header.column.columnDef.header, header.getContext())}</th>
                        ))}
                     </tr>
                  ))}
               </thead>

               <tbody className=''>
                  {table.getRowModel().rows.map((row) => (
                     <tr key={row.id} className=''>
                        {row.getVisibleCells().map((cell) => (
                           <td key={cell.id} className='text-black font-normal font-sans text-base px-6 py-3'>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                        <td><button onClick={() => onButtonClick(row.getAllCells()[0].getValue() as number)} className='text-white bg-blue py-2 px-4 text-base font-semibold font-inter rounded-xl'>{buttonText}</button></td>
                     </tr>
                  ))}
               </tbody>

            </table>
         </div>
      </>
   )
}

export default Table