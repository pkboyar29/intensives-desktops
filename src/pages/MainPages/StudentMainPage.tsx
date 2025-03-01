import { FC, useEffect } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';

import { useLazyGetMyTeamQuery } from '../../redux/api/teamApi';
import { useGetIntensiveQuery } from '../../redux/api/intensiveApi';

import { useAppDispatch, useAppSelector } from '../../redux/store';
import { resetIntensiveState } from '../../redux/slices/intensiveSlice';

import IntensiveNotFoundComponent from '../../components/IntensiveNotFoundComponent';
import PrimaryButton from '../../components/common/PrimaryButton';
import Sidebar from '../../components/Sidebar';
import SidebarLink from '../../components/SidebarLink';
import Skeleton from 'react-loading-skeleton';

const StudentMainPage: FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  const dispatch = useAppDispatch();

  const { isLoading: isIntensiveLoading, isError } = useGetIntensiveQuery(
    Number(params.intensiveId),
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [getMyTeam, { isLoading: isTeamLoading }] = useLazyGetMyTeamQuery();

  const currentIntensive = useAppSelector((state) => state.intensive.data);
  const currentTeam = useAppSelector((state) => state.team.data);

  useEffect(() => {
    if (currentIntensive) {
      getMyTeam(currentIntensive.id);
    }
  }, [currentIntensive]);

  const returnToIntensivesClickHandler = () => {
    navigate(`/intensives`);
    dispatch(resetIntensiveState());
  };

  return (
    <>
      {isError ? (
        <IntensiveNotFoundComponent />
      ) : (
        <div className="grid grid-cols-[auto,1fr]">
          <Sidebar>
            {isIntensiveLoading ? (
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
            </div>

            <div className="my-3">
              {isTeamLoading ? (
                <Skeleton />
              ) : (
                <>
                  <div className="text-xl font-bold text-black_2">
                    {currentTeam?.name}
                  </div>

                  <div className="flex flex-col gap-4 my-3">
                    <SidebarLink to="team-overview" text="Просмотр команды" />
                    <SidebarLink to="schedule" text="Мероприятия команды" />
                    <SidebarLink to="kanban" text="Ведение задач" />
                  </div>
                </>
              )}
            </div>

            <PrimaryButton
              children="Вернуться к списку интенсивов"
              clickHandler={returnToIntensivesClickHandler}
            />
          </Sidebar>
          <div className="w-full px-10 pt-5">
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
};

export default StudentMainPage;
