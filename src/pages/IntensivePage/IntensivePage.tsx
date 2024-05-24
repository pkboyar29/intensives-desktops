import { FC, useContext } from 'react'
import { Outlet, Link, useParams } from 'react-router-dom'

import { Intensive } from '../../utils/types/Intensive'

import Sidebar from '../../components/Sidebar/Sidebar'
import { IntensivesContext } from '../../context/IntensivesContext'

import './IntensivePage'

const IntensivePage: FC = () => {

   const params = useParams()

   const { intensives } = useContext(IntensivesContext)
   const currentIntensive: Intensive | undefined = intensives.find((intensive: Intensive) => intensive.id === Number(params.intensiveId))

   return (
      <>
         <div className='main'>
            <Sidebar>
               <li className='sidebar__item sidebar__title'>{currentIntensive?.name}</li>
               <li className='sidebar__item'><Link to="overview">Просмотр интенсива</Link></li>
               <li className='sidebar__item'><Link to="teams">Команды</Link></li>
               <li className='sidebar__item'><Link to="events">Мероприятия</Link></li>
               <li className='sidebar__item'><Link to="education-requests">Образовательные запросы</Link></li>
               <button className='sidebar__btn'><Link to="/intensives">Вернуться к списку интенсивов</Link></button>
            </Sidebar>

            <div className="content">
               <Outlet />
            </div>
         </div>
      </>
   )
}

export default IntensivePage