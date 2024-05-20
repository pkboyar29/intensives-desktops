import { FC } from 'react'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import './Table.css'

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
         <div className='table__container'>
            <table className='table'>

               <thead className='thead'>
                  {table.getHeaderGroups().map((headerGroup) => (
                     <tr key={headerGroup.id} className='thead__row'>
                        {headerGroup.headers.map((header) => (
                           <th key={header.id} className='thead__cell'>{flexRender(header.column.columnDef.header, header.getContext())}</th>
                        ))}
                     </tr>
                  ))}
               </thead>

               <tbody className='tbody'>
                  {table.getRowModel().rows.map((row) => (
                     <tr key={row.id} className='tbody__row'>
                        {row.getVisibleCells().map((cell) => (
                           <td key={cell.id} className='tbody__cell'>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                        <td><button onClick={() => onButtonClick(row.getAllCells()[0].getValue() as number)} className='tbody__btn'>{buttonText}</button></td>
                     </tr>
                  ))}
               </tbody>

            </table>
         </div>
      </>
   )
}

export default Table