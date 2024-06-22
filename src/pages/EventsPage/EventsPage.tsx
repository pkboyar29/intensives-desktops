import { FC, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createColumnHelper } from '@tanstack/react-table'

import { EventsContext } from '../../context/EventsContext'
import { CurrentUserContext } from '../../context/CurrentUserContext'
import { Event } from '../../utils/types/Event'

import Title from '../../components/Title/Title'
import Table from '../../components/Table/Table'

const EventsPage: FC = () => {
   const navigate = useNavigate()
   const params = useParams()

   const { events, setEventsForIntensiv, setEventsForTeam } = useContext(EventsContext)
   const { currentUser } = useContext(CurrentUserContext)
   const [isLoading, setIsLoading] = useState<boolean>(true)

   useEffect(() => {
      const fetchData = async () => {
         if (params.intensiveId && currentUser) {
            await setEventsForIntensiv(parseInt(params.intensiveId, 10))
            setIsLoading(false)
         }
      }
      fetchData()
   }, [currentUser, params.intensiveId])

   useEffect(() => {
      const fetchData = async () => {
         if (params.teamId && currentUser) {
            await setEventsForTeam(parseInt(params.teamId))
            setIsLoading(false)
         }
      }
      fetchData()
   }, [currentUser, params.teamId])

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

   if (isLoading) {
      return (
         <div className='font-bold font-sans text-2xl mt-3'>Загрузка...</div>
      )
   }

   return (
      <>
         <Title text='Все мероприятия' />

         <Table data={events} columns={columns} buttonText='посмотреть' onButtonClick={(id: number) => navigate(`${id}`)} />
      </>
   )
}

export default EventsPage