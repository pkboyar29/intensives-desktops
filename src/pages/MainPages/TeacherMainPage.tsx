import { FC } from 'react';
import { Outlet, NavLink, useNavigate, useParams } from 'react-router-dom';

import { useGetIntensiveQuery } from '../../redux/api/intensiveApi';

import { useAppDispatch } from '../../redux/store';
import { resetIntensiveState } from '../../redux/slices/intensiveSlice';

import IntensiveNotFoundComponent from './components/IntensiveNotFoundComponent';
import Sidebar from './components/Sidebar';
import SidebarLink from './components/SidebarLink';
import PrimaryButton from '../../components/common/PrimaryButton';
import Skeleton from 'react-loading-skeleton';

const TeacherMainPage: FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();

  const {
    data: currentIntensive,
    isLoading,
    isError,
  } = useGetIntensiveQuery(Number(params.intensiveId));

  const returnToIntensivesClickHandler = () => {
    dispatch(resetIntensiveState());
    navigate(`/intensives`);
  };

  // TODO: где-то идет лютый gap

  return (
    <>
      {isError ? (
        <IntensiveNotFoundComponent />
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
                <SidebarLink to="overview" text="Просмотр интенсива" />
                <SidebarLink to="teams" text="Команды" />
                <SidebarLink to="events" text="Мероприятия" />
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

export default TeacherMainPage;
