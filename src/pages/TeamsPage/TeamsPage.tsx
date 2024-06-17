import { FC, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { TeamsContext } from '../../context/TeamsContext'
import { createColumnHelper } from '@tanstack/react-table'

import { Team } from '../../utils/types/Team'

import Title from '../../components/Title/Title'
import Table from '../../components/Table/Table'

const TeamsPage: FC = () => {
   const params = useParams()
   const { teams, getTeams } = useContext(TeamsContext)

   useEffect(() => {
      console.log('вызов getTeams')
      if (params.intensiveId) {
         getTeams(parseInt(params.intensiveId, 10))
      }
   }, [])

   const columnHelper = createColumnHelper<Team>()
   const columns = [
      columnHelper.accessor('id', {
         header: () => 'ID',
         cell: (info) => info.getValue()
      }),
      columnHelper.accessor('name', {
         header: () => 'Название команды',
         cell: (info) => info.getValue()
      }),
      columnHelper.accessor('tutorNameSurname', {
         header: () => 'Тьютор',
         cell: (info) => info.getValue()
      }),
      columnHelper.accessor('mentorNameSurname', {
         header: () => 'Наставник',
         cell: (info) => info.getValue()
      })
   ]

   return (
      <>
         <Title text='Команды в интенсиве' />
         
         <Table data={teams} columns={columns} buttonText='посмотреть' onButtonClick={(id: number) => console.log(`id команды вот такой: ${id}`)} />
      </>
   )
}

export default TeamsPage