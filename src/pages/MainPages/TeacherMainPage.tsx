import { FC } from 'react';
import { Outlet, NavLink, Link, useParams } from 'react-router-dom';

import { useGetIntensiveQuery } from '../../redux/api/intensiveApi';

import Sidebar from '../../components/Sidebar';
import Skeleton from 'react-loading-skeleton';

const TeacherMainPage: FC = () => {
  const params = useParams();

  const { data: currentIntensive, isLoading } = useGetIntensiveQuery(
    Number(params.intensiveId)
  );

  return (
    <>
      <div className="flex h-full">
        <Sidebar>
          {currentIntensive ? (
            <li className="font-sans text-base font-bold text-black">
              {currentIntensive.name}
            </li>
          ) : (
            <Skeleton />
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
              to="teams"
            >
              Команды
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
          <Link
            className="block text-center mt-2 px-2 py-4 bg-blue rounded-xl text-white text-[14px] font-inter font-bold"
            to="/intensives"
          >
            Вернуться к списку интенсивов
          </Link>
        </Sidebar>
        <div className="w-full p-10">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default TeacherMainPage;
