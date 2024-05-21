import { FC, useContext } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'

import { Intensive } from '../../utils/types/Intensive'
import { IntensivesContext } from '../../context/IntensivesContext'

import './IntensivesPage.css'
import Table from '../../components/Table/Table'
import Title from '../../components/Title/Title'

const IntensivesPage: FC = () => {

   const navigate = useNavigate()

   const columnHelper = createColumnHelper<Intensive>()
   const columns = [
      columnHelper.accessor('id', {
         header: () => 'ID',
         cell: (info) => info.getValue()
      }),
      columnHelper.accessor('name', {
         header: () => 'Наименование',
         cell: (info) => info.getValue()
      }),
      columnHelper.accessor('descr', {
         header: () => 'Описание',
         cell: (info) => info.getValue()
      }),
      columnHelper.accessor('openDate', {
         header: () => 'Начало интенсива',
         cell: (info) => info.getValue().toLocaleDateString()
      }),
      columnHelper.accessor('closeDate', {
         header: () => 'Конец интенсива',
         cell: (info) => info.getValue().toLocaleDateString()
      }),
      columnHelper.accessor('flow', {
         header: () => 'Поток',
         cell: (info) => info.getValue()
      }),
   ]

   const intensives: Intensive[] = useContext(IntensivesContext)

   return (
      <>
         <div className='container'>
            <Title text='Интенсивы' />

            <Table onButtonClick={(id: number) => navigate(`/intensive/${id}/overview`)} buttonText='Посмотреть' columns={columns} data={intensives} />
         </div>
      </>
   )
}

export default IntensivesPage