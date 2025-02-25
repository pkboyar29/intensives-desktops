import { FC, useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { useGetIntensiveQuery } from '../../redux/api/intensiveApi';
import { useLazyGetTeamQuery } from '../../redux/api/teamApi';

import { useAppDispatch, useAppSelector } from '../../redux/store';
import { resetIntensiveState } from '../../redux/slices/intensiveSlice';
import { resetTeamState, setTeam } from '../../redux/slices/teamSlice';

import IntensiveNotFoundComponent from '../../components/IntensiveNotFoundComponent';
import Sidebar from '../../components/Sidebar';
import SidebarLink from '../../components/SidebarLink';
import PrimaryButton from '../../components/common/PrimaryButton';
import Skeleton from 'react-loading-skeleton';

const TeacherMainPage: FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();

  const [getTeam] = useLazyGetTeamQuery();

  const { isLoading, isError } = useGetIntensiveQuery(
    Number(params.intensiveId),
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const currentIntensive = useAppSelector((state) => state.intensive.data);
  const currentTeam = useAppSelector((state) => state.team.data);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data: team } = await getTeam(
        Number(localStorage.getItem('tutorTeamId'))
      );
      if (team) {
        dispatch(setTeam(team));
      }
    };
    fetchTeam();
  }, []);

  const returnToIntensivesClickHandler = () => {
    dispatch(resetIntensiveState());
    dispatch(resetTeamState());
    navigate(`/intensives`);
  };

  return (
    <>
      {isError ? (
        <IntensiveNotFoundComponent />
      ) : (
        <div className="grid grid-cols-[auto,1fr]">
          <Sidebar>
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

            {currentTeam && (
              <div className="my-3">
                <div className="text-xl font-bold text-black_2">
                  {currentTeam.name}
                </div>

                <div className="flex flex-col gap-4 my-3">
                  <SidebarLink to="team-overview" text="Просмотр команды" />
                  <SidebarLink to="kanban" text="Ведение задач" />
                </div>
              </div>
            )}

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

export default TeacherMainPage;
