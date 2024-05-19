import { FC } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'

import { Intensive } from '../../utils/types/Intensive'

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

   const data: Intensive[] = [
      {
         id: 1,
         name: "Веб-разработка",
         descr: "Интенсив по современным технологиям веб-разработки.",
         openDate: new Date('2024-06-01'),
         closeDate: new Date('2024-07-01'),
         flow: "Поток 20-ИCбо"
      },
      {
         id: 2,
         name: "Погружение в бэк-разработку",
         descr: "Интенсив по созданию серверных приложений и API.",
         openDate: new Date('2024-07-05'),
         closeDate: new Date('2024-08-05'),
         flow: "Поток 20-ИCбо"
      },
      {
         id: 3,
         name: "Разработка игр",
         descr: "Интенсив по разработке компьютерных игр с использованием Unity и Unreal Engine.",
         openDate: new Date('2024-08-10'),
         closeDate: new Date('2024-09-10'),
         flow: "Поток 20-ИCбо"
      },
      {
         id: 4,
         name: "Мобильная разработка",
         descr: "Интенсив по созданию мобильных приложений для iOS и Android.",
         openDate: new Date('2024-09-15'),
         closeDate: new Date('2024-10-15'),
         flow: "Поток 20-ИCбо"
      },
      {
         id: 5,
         name: "Дизайн и UX",
         descr: "Интенсив по основам дизайна и пользовательского опыта.",
         openDate: new Date('2024-10-20'),
         closeDate: new Date('2024-11-20'),
         flow: "Поток 20-ИCбо"
      }
   ]

   return (
      <>
         <div className='container'>
            <Title text='Интенсивы' />

            <Table onButtonClick={(id: number) => navigate('/intensive/' + id)} buttonText='Посмотреть' columns={columns} data={data} />
         </div>
      </>
   )
}

export default IntensivesPage