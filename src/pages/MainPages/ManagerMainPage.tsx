import { FC } from 'react';
import { Outlet, NavLink, useParams, useNavigate } from 'react-router-dom';

import { useGetIntensiveQuery } from '../../redux/api/intensiveApi';

import { useAppDispatch, useAppSelector } from '../../redux/store';
import { resetIntensiveState } from '../../redux/slices/intensiveSlice';

import Sidebar from '../../components/Sidebar';
import PrimaryButton from '../../components/PrimaryButton';
import Skeleton from 'react-loading-skeleton';
import BackArrowIcon from '../../components/icons/BackArrowIcon';

const ManagerMainPage: FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();

  const { isLoading, isError } = useGetIntensiveQuery(
    Number(params.intensiveId),
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const currentIntensive = useAppSelector((state) => state.intensive.data);

  const linkClassNames =
    'py-2 px-2.5 rounded-xl hover:bg-another_white transition duration-200 ease-in-out manager-sidebar__link';

  const returnToIntensivesClickHandler = () => {
    dispatch(resetIntensiveState());
    navigate(`/intensives`);
  };

  return (
    <>
      {isError ? (
        <div className="flex flex-col items-center gap-5 mt-20">
          <div className="text-2xl font-bold">
            Интенсива с данным id не существует
          </div>
          <div className="w-fit">
            <PrimaryButton
              buttonColor="gray"
              children={
                <div className="flex items-center gap-2">
                  <BackArrowIcon />
                  <p>Вернуться к списку интенсивов</p>
                </div>
              }
              onClick={() => {
                navigate(`/intensives`);
              }}
            />
          </div>
        </div>
      ) : (
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
                    {currentIntensive?.openDate.toLocaleDateString()}
                    {` - `}
                    {currentIntensive?.closeDate.toLocaleDateString()}
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
                  Управление расписанием
                </NavLink>
                <NavLink to="statistics" className={linkClassNames}>
                  Статистика
                </NavLink>
              </div>
              <PrimaryButton
                children="Вернуться к списку интенсивов"
                clickHandler={returnToIntensivesClickHandler}
              />
            </div>
          </Sidebar>
          <div className="w-full p-10">
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
};

export default ManagerMainPage;
