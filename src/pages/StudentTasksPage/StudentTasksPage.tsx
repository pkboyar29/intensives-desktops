import './StudentTasksPage.css'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentTaskElem from '../../components/StudentTaskElem/StudentTaskElem'
import Title from '../../components/Title/Title';

const StudentTasksPage: FC = () => {

    return(
    <div className='student-tasks-page'>
        <div className='container'>
            <Title text='Мои задачи' />
            <span>2 задачи, 1 в процессе</span>
            <div>
                <StudentTaskElem name="Задача 1" desc="описание задачи" finish_dt={new Date('2024-07-01')}/>
            </div>
        </div>
    </div>
    )
}

export default StudentTasksPage;