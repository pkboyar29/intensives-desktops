import { FC } from 'react';
import { NavLink, Outlet, useParams, useNavigate } from 'react-router-dom';

import { useGetIntensiveQuery } from '../../redux/api/intensiveApi';

import IntensiveNotFoundComponent from './components/IntensiveNotFoundComponent';
import PrimaryButton from '../../components/common/PrimaryButton';
import Sidebar from './components/Sidebar';
import SidebarLink from './components/SidebarLink';
import Skeleton from 'react-loading-skeleton';

const StudentMainPage: FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  const {
    data: currentIntensive,
    isLoading,
    isError,
  } = useGetIntensiveQuery(Number(params.intensiveId));

  const returnToIntensivesClickHandler = () => {
    navigate(`/intensives`);
  };

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
                <SidebarLink to="team-overview" text="Просмотр команды" />
                <SidebarLink to="events" text="Мероприятия" />
                <SidebarLink to="tasks-board" text="Ведение проекта" />
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

export default StudentMainPage;
