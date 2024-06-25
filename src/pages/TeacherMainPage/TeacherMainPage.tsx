import { FC, useContext } from 'react'
import { Outlet, NavLink, Link, useParams } from 'react-router-dom'

import { Intensive } from '../../utils/types/Intensive'

import Sidebar from '../../components/Sidebar/Sidebar'
import { IntensivesContext } from '../../context/IntensivesContext'

const TeacherMainPage: FC = () => {
   const params = useParams()

   const { intensives } = useContext(IntensivesContext)
   const currentIntensive: Intensive | undefined = intensives.find((intensive: Intensive) => intensive.id === Number(params.intensiveId))

   return (
      <>
         <div className='h-full flex'>
            <Sidebar>
               <li className='text-black text-base font-bold font-sans'>{currentIntensive?.name}</li>
               <li><NavLink className='sidebar__link text-black hover:text-blue transition-all text-base font-semibold font-sans'
                  to='overview'>Просмотр интенсива</NavLink></li>
               <li><NavLink className='sidebar__link text-black hover:text-blue transition-all text-base font-semibold font-sans'
                  to='teams'>Команды</NavLink></li>
               <li><NavLink className='sidebar__link text-black hover:text-blue transition-all text-base font-semibold font-sans'
                  to='events'>Мероприятия</NavLink></li>
               {/* <li><NavLink className='sidebar__link text-black hover:text-blue transition-all text-base font-semibold font-sans'
                  to='education-requests'>Образовательные запросы</NavLink></li> */}
               <button className='bg-blue rounded-xl px-2 py-4'><Link className='text-white text-[14px] font-inter font-bold' to='/intensives1'>Вернуться к списку интенсивов</Link></button>
            </Sidebar>
            <div className='w-full p-10'>
               <Outlet />
            </div>
         </div >
      </>
   )
}

export default TeacherMainPage