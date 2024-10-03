import { FC } from 'react';
import { Outlet, NavLink, useNavigate, useParams } from 'react-router-dom';

import { useGetIntensiveQuery } from '../../redux/api/intensiveApi';

import { useAppDispatch } from '../../redux/store';
import { resetIntensiveState } from '../../redux/slices/intensiveSlice';

import Sidebar from '../../components/Sidebar';
import PrimaryButton from '../../components/PrimaryButton';
import Skeleton from 'react-loading-skeleton';

const TeacherMainPage: FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();

  const { data: currentIntensive, isLoading } = useGetIntensiveQuery(
    Number(params.intensiveId)
  );

  const returnToIntensivesClickHandler = () => {
    dispatch(resetIntensiveState());
    navigate(`/intensives`);
  };

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
          <PrimaryButton
            text="Вернуться к списку интенсивов"
            clickHandler={returnToIntensivesClickHandler}
          />
        </Sidebar>
        <div className="w-full p-10">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default TeacherMainPage;
