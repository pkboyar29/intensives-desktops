import ProfilePicture from '../../components/ProfilePicture/ProfilePicture';
import './StudentTasksPage.css'
import { FC } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { TaskTableRow } from '../../utils/types/Task';
import Title from '../../components/Title/Title';
import Table from '../../components/Table/Table';
import { useNavigate } from 'react-router-dom'


const StudentTasksPage: FC = () => {
    const navigate = useNavigate()
    const intensives: TaskTableRow[] = [
        {
           name: "Задача 1",
           assignee: 0,
           finish_dt: new Date('2024-07-01'),
           status: "To Do"
        },
    ]
    const columnHelper = createColumnHelper<TaskTableRow>()
    const columns = [
        columnHelper.accessor('name', {
           header: () => 'Название',
           cell: (info) => info.getValue()
        }),
        columnHelper.accessor('assignee', {
           header: () => 'Ответственные',
           cell: (info) => <ProfilePicture size={45}/> //скорее всего надо отдельный компонент куда передается number[] и там запрос для получения аватарок для каждого id и адаптивное отображение
        }),
        columnHelper.accessor('finish_dt', {
           header: () => 'Срок сдачи',
           cell: (info) => info.getValue().toLocaleDateString()
        }),
        columnHelper.accessor('status', {
           header: () => 'Статус',
           cell: (info) => info.getValue()
        }),
     ]
    return(
    <div className='student-tasks-page'>
        <div className='container'>
            <Title text='Интенсивы' />
            <Table onButtonClick={(id: number) => navigate(`/tasks/${id}/`)} buttonText='Редактировать' columns={columns} data={intensives} />
        </div>
    </div>
    )
}

export default StudentTasksPage;