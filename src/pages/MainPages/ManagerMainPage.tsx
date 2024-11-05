import { FC } from 'react';
import {
  Outlet,
  Link,
  NavLink,
  useParams,
  useNavigate,
} from 'react-router-dom';

import { useGetIntensiveQuery } from '../../redux/api/intensiveApi';

import { useAppDispatch } from '../../redux/store';
import { resetIntensiveState } from '../../redux/slices/intensiveSlice';

import Sidebar from '../../components/Sidebar';
import PrimaryButton from '../../components/PrimaryButton';
import Skeleton from 'react-loading-skeleton';

const ManagerMainPage: FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();

  const { data: currentIntensive, isLoading } = useGetIntensiveQuery(
    Number(params.intensiveId),
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const linkClassNames =
    'py-2 px-2.5 rounded-xl hover:bg-another_white transition duration-200 ease-in-out manager-sidebar__link';

  const returnToIntensivesClickHandler = () => {
    dispatch(resetIntensiveState());
    navigate(`/intensives`);
  };

  return (
    <>
      <div className="flex h-full">
        <Sidebar>
          <div className="w-80">
            {isLoading ? (
              <Skeleton />
            ) : (
              <>
                <div className="text-xl font-bold text-black_2">
                  {currentIntensive?.name}
                </div>
                <div className="mt-2 text-bright_gray">
                  {currentIntensive?.open_dt.toLocaleDateString()}
                  {` - `}
                  {currentIntensive?.close_dt.toLocaleDateString()}
                </div>
              </>
            )}

            <div className="flex flex-col gap-4 my-3">
              <NavLink to="overview" className={linkClassNames}>
                Настройки интенсива
              </NavLink>
              <NavLink to="teams" className={linkClassNames}>
                Управление командами
              </NavLink>
              <NavLink to="schedule" className={linkClassNames}>
                Расписание интенсива
              </NavLink>
              <NavLink to="manageRoles" className={linkClassNames}>
                Управление ролями для студентов
              </NavLink>
              <NavLink to="statistics" className={linkClassNames}>
                Статистика
              </NavLink>
            </div>
            <PrimaryButton
              text="Вернуться к списку интенсивов"
              clickHandler={returnToIntensivesClickHandler}
            />
          </div>
        </Sidebar>
        <div className="w-full p-10">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default ManagerMainPage;
