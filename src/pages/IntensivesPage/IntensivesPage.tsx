import { FC, useContext, useEffect } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'

import { Intensive } from '../../utils/types/Intensive'
import { IntensivesContext } from '../../context/IntensivesContext'
import { CurrentUserContext } from '../../context/CurrentUserContext'

import Table from '../../components/Table/Table'
import Title from '../../components/Title/Title'

const IntensivesPage: FC = () => {
   const navigate = useNavigate()

   const { intensives, getIntensives } = useContext(IntensivesContext)
   const { currentUser } = useContext(CurrentUserContext)

   useEffect(() => {
      if (currentUser != null) {
         getIntensives()
      }
   }, [currentUser])

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
      columnHelper.accessor('open_dt', {
         header: () => 'Начало интенсива',
         cell: (info) => info.getValue().toLocaleDateString()
      }),
      columnHelper.accessor('close_dt', {
         header: () => 'Конец интенсива',
         cell: (info) => info.getValue().toLocaleDateString()
      })
   ]

   if (intensives.length === 0) {
      return (
         <div className='container'>
            <Title text='Для вас пока нету открытых интенсивов' />
         </div>
      )
   }

   return (
      <>
         <div className='container'>
            <Title text='Открытые интенсивы' />

            <Table onButtonClick={(id: number) => navigate(`/intensive/${id}/overview`)} buttonText='Посмотреть' columns={columns} data={intensives} />
         </div>
      </>
   )
}

export default IntensivesPage