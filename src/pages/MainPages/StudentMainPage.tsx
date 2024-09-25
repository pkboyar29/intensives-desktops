import { FC } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';

import { useGetIntensiveQuery } from '../../redux/api/intensiveApi';

import Sidebar from '../../components/Sidebar';
import Skeleton from 'react-loading-skeleton';

const StudentMainPage: FC = () => {
  const params = useParams();

  const { data: currentIntensive, isLoading } = useGetIntensiveQuery(
    Number(params.intensiveId)
  );

  return (
    <>
      <div className="flex h-full">
        <Sidebar>
          {isLoading ? (
            <Skeleton />
          ) : (
            <li className="font-sans text-base font-bold text-black">
              {currentIntensive?.name}
            </li>
          )}
          <li>
            <NavLink
              className="font-sans text-base font-semibold text-black transition-all sidebar__link hover:text-blue"
              to="overview"
            >
              Просмотр интенсива
            </NavLink>
          </li>
          <li>
            <NavLink
              className="font-sans text-base font-semibold text-black transition-all sidebar__link hover:text-blue"
              to="team-overview"
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
              Ведение проекта
            </NavLink>
          </li>
        </Sidebar>
        <div className="w-full mt-10 ml-10">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default StudentMainPage;
