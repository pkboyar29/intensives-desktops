import { FC } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import Sidebar from '../../components/Sidebar/Sidebar';

const StudentMainPage: FC = () => {
  return (
    <>
      <div className="flex h-full">
        <Sidebar>
          {/* <li className='font-sans text-base font-bold text-black'>{currentIntensive?.name}</li> */}
          <li>
            <NavLink
              className="font-sans text-base font-semibold text-black transition-all sidebar__link hover:text-blue"
              to="intensiv-overview"
            >
              Просмотр интенсива
            </NavLink>
          </li>
          <li>
            <NavLink
              className="font-sans text-base font-semibold text-black transition-all sidebar__link hover:text-blue"
              to="overview"
            >
              Просмотр команды
            </NavLink>
          </li>
          <li>
            <NavLink
              className="font-sans text-base font-semibold text-black transition-all sidebar__link hover:text-blue"
              to="events"
            >
              Мероприятия
            </NavLink>
          </li>
          <li>
            <NavLink
              className="font-sans text-base font-semibold text-black transition-all sidebar__link hover:text-blue"
              to="tasks-board"
            >
              Задачи
            </NavLink>
          </li>
          {/* <li><NavLink className='font-sans text-base font-semibold text-black transition-all sidebar__link hover:text-blue'
                  to='education-requests'>Образовательные запросы</NavLink></li> */}
        </Sidebar>
        <div className="w-full mt-10 ml-10">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default StudentMainPage;
