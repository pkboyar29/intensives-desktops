import { FC } from 'react';
import { Outlet, Link, useParams, useNavigate } from 'react-router-dom';

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
                <div className="text-lg">{currentIntensive?.name}</div>
                <div className="text-bright_gray">
                  {currentIntensive?.open_dt.toLocaleDateString()}
                  {` - `}
                  {currentIntensive?.close_dt.toLocaleDateString()}
                </div>
              </>
            )}

            <div className="flex flex-col gap-4 my-3">
              <Link
                to="overview"
                className="py-1.5 px-2.5 hover:bg-another_white"
              >
                Настройки интенсива
              </Link>
              <Link to="teams" className="py-1.5 px-2.5 hover:bg-another_white">
                Управление командами
              </Link>
              <Link to="plan" className="py-1.5 px-2.5 hover:bg-another_white">
                Расписание интенсива
              </Link>
              <Link
                to="manageRoles"
                className="py-1.5 px-2.5 hover:bg-another_white"
              >
                Управление ролями для студентов
              </Link>
              <Link
                to="statistics"
                className="py-1.5 px-2.5 hover:bg-another_white"
              >
                Статистика
              </Link>
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
