import { FC, useContext } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'

import { EducationRequest } from '../../utils/types/EducationRequest'

import { EducationRequestsContext } from '../../context/EducationRequestsContext'

import './EducationRequestsPage.css'
import Title from '../../components/Title/Title'
import Table from '../../components/Table/Table'

const EducationRequestsPage: FC = () => {

   const navigate = useNavigate()

   const educationRequests: EducationRequest[] = useContext(EducationRequestsContext)
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
      columnHelper.accessor('teamName', {
         header: () => 'Команда',
         cell: (info) => info.getValue()
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

export default EducationRequestsPage