import { FC, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createColumnHelper } from '@tanstack/react-table'

import { EventsContext } from '../../context/EventsContext'
import { CurrentUserContext } from '../../context/CurrentUserContext'
import { Event } from '../../utils/types/Event'

import './EventsPage.css'
import Title from '../../components/Title/Title'
import Table from '../../components/Table/Table'

const EventsPage: FC = () => {

   const navigate = useNavigate()
   const params = useParams()

   const { events, getEvents } = useContext(EventsContext)
   const { currentUser } = useContext(CurrentUserContext)

   useEffect(() => {
      if (params.intensiveId && currentUser) {
         getEvents(parseInt(params.intensiveId, 10))
      }
   }, [currentUser])

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
         cell: (info) => info.getValue().toLocaleString()
      }),
      columnHelper.accessor('finishDate', {
         header: () => 'Конец мероприятия',
         cell: (info) => info.getValue().toLocaleString()
      }),
   ]


   return (
      <>
         <Title text='Все мероприятия' />
         <Table data={events} columns={columns} buttonText='посмотреть' onButtonClick={(id: number) => navigate(`${id}`)} />
      </>
   )
}

export default EventsPage