import { FC } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import Sidebar from '../../components/Sidebar/Sidebar'

const StudentMainPage: FC = () => {
   return (
      <>
         <div className='h-full flex'>
            <Sidebar>
               {/* <li className='text-black text-base font-bold font-sans'>{currentIntensive?.name}</li> */}
               <li><NavLink className='sidebar__link text-black hover:text-blue transition-all text-base font-semibold font-sans'
                  to='intensiv-overview'>Просмотр интенсива</NavLink></li>
               <li><NavLink className='sidebar__link text-black hover:text-blue transition-all text-base font-semibold font-sans'
                  to='overview'>Просмотр команды</NavLink></li>
               <li><NavLink className='sidebar__link text-black hover:text-blue transition-all text-base font-semibold font-sans'
                  to='events'>Мероприятия</NavLink></li>
               {/* <li><NavLink className='sidebar__link text-black hover:text-blue transition-all text-base font-semibold font-sans'
                  to='tasks'>Задачи</NavLink></li>
               <li><NavLink className='sidebar__link text-black hover:text-blue transition-all text-base font-semibold font-sans'
                  to='education-requests'>Образовательные запросы</NavLink></li> */}
            </Sidebar>
            <div className='w-full p-10'>
               <Outlet />
            </div>
         </div >
      </>
   )
}

export default StudentMainPage