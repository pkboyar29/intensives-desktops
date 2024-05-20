import { FC } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'


import { EducationRequest } from '../../utils/types/EducationRequest'

import { educationRequests } from '../../data/educationRequests'

import './IntensiveEducationRequestsPage.css'
import Title from '../../components/Title/Title'
import Table from '../../components/Table/Table'

const IntensiveEducationRequestsPage: FC = () => {

   const navigate = useNavigate()

   const columnHelper = createColumnHelper<EducationRequest>()
   const columns = [
      columnHelper.accessor('id', {
         header: () => 'ID',
         cell: (info) => info.getValue()
      }),
      columnHelper.accessor('subject', {
         header: () => 'Тема запроса',
         cell: (info) => info.getValue()
      }),
      columnHelper.accessor('teamNumber', {
         header: () => 'Команда',
         cell: (info) => 'Команда ' + info.getValue()
      }),
      columnHelper.accessor('createdDate', {
         header: () => 'Дата создания запроса',
         cell: (info) => info.getValue().toLocaleDateString()
      }),
   ]

   return (
      <>
         <Title text='Образовательные запросы' />


         <Table onButtonClick={(id: number) => navigate(`${id}`)} buttonText='Посмотреть' data={educationRequests} columns={columns} />
      </>
   )
}

export default IntensiveEducationRequestsPage