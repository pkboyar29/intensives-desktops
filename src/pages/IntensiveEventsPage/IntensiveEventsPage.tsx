import { FC, useContext } from 'react'
import { createColumnHelper } from '@tanstack/react-table'

import { EventsContext } from '../../context/EventsContext'
import { Event } from '../../utils/types/Event'

import './IntensiveEventsPage.css'
import Title from '../../components/Title/Title'
import Table from '../../components/Table/Table'

const IntensiveEventsPage: FC = () => {

   const events = useContext(EventsContext)
   const columnHelper = createColumnHelper<Event>()
   const columns = [
      columnHelper.accessor('id', {
         header: () => 'ID',
         cell: (info) => info.getValue()
      }),
      columnHelper.accessor('name', {
         header: () => 'Наименование',
         cell: (info) => info.getValue()
      }),
      columnHelper.accessor('startDate', {
         header: () => 'Начало мероприятия',
         cell: (info) => info.getValue().toLocaleDateString()
      }),
      columnHelper.accessor('finishDate', {
         header: () => 'Конец мероприятия',
         cell: (info) => info.getValue().toLocaleDateString()
      }),
   ]


   return (
      <>
         <Title text='Мероприятия' />
         <Table data={events} columns={columns} buttonText='посмотреть' onButtonClick={(id: number) => console.log(id)} />
      </>
   )
}

export default IntensiveEventsPage