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
            <table className='table'>
               <thead className='thead'>
                  {table.getHeaderGroups().map((headerGroup) => (
                     <tr key={headerGroup.id} className='thead__row'>
                        {headerGroup.headers.map((header) => (
                           <th key={header.id} className='thead__cell text-left text-thead_cell font-bold font-sans text-xl p-3' >{flexRender(header.column.columnDef.header, header.getContext())}</th>
                        ))}
                     </tr>
                  ))}
               </thead>

               <tbody className='tbody'>
                  {table.getRowModel().rows.map((row) => (
                     <tr key={row.id} className='tbody__row'>
                        {row.getVisibleCells().map((cell) => (
                           <td key={cell.id} className='tbody__cell text-bright_gray font-normal font-sans text-base p-3'>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                        <td><button onClick={() => onButtonClick(row.getAllCells()[0].getValue() as number)} className='text-white bg-blue py-3 px-4 text-base font-bold font-inter rounded-xl'>{buttonText}</button></td>
                     </tr>
                  ))}
               </tbody>

            </table>
         </div>
      </>
   )
}

export default Table