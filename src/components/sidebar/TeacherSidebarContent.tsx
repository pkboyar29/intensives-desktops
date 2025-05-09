import { useEffect, FC } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { useLazyGetTeamQuery, useGetTeamsQuery } from '../../redux/api/teamApi';
import { resetIntensiveState } from '../../redux/slices/intensiveSlice';
import { resetTeamState, setTeam } from '../../redux/slices/teamSlice';
import { setIsSidebarOpen } from '../../redux/slices/windowSlice';
import { useWindowSize } from '../../helpers/useWindowSize';

import Skeleton from 'react-loading-skeleton';
import SidebarLink from './SidebarLink';
import PrimaryButton from '../common/PrimaryButton';

import { ITeam } from '../../ts/interfaces/ITeam';

const TeacherSidebarContent: FC<{ isIntensiveLoading: boolean }> = ({
  isIntensiveLoading,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { intensiveId } = useParams();
  const dispatch = useAppDispatch();

  const { width: windowWidth } = useWindowSize();

  const currentTeam = useAppSelector((state) => state.team.data);
  const currentIntensive = useAppSelector((state) => state.intensive.data);

  const { data: tutorTeams } = useGetTeamsQuery({
    intensiveId: Number(intensiveId),
    tutor: true,
    short: true,
  });

  const [getTeam] = useLazyGetTeamQuery();

  useEffect(() => {
    const fetch = async () => {
      const currentTeamId = Number(sessionStorage.getItem('currentTeam'));

      if (currentTeamId) {
        const team = await fetchTeam(currentTeamId);
        if (team) {
          dispatch(setTeam(team));
        }
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (windowWidth < 768) {
      dispatch(setIsSidebarOpen(false));
    }
  }, [pathname]);

  const fetchTeam = async (teamId: number): Promise<ITeam> => {
    const { data: team } = await getTeam(teamId);

    return team as ITeam;
  };

  const onTeamButtonClick = async (teamId: number) => {
    const team = await fetchTeam(teamId);

    sessionStorage.setItem('currentTeam', team.id.toString());
    dispatch(setTeam(team));

    navigate(`/intensives/${intensiveId}/team-overview`);
  };

  const returnToIntensivesClickHandler = () => {
    dispatch(resetIntensiveState());
    dispatch(resetTeamState());
    navigate(`/intensives`);
  };

  return (
    <>
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
        <SidebarLink to="schedule" text="Мероприятия" />
      </div>

      {tutorTeams && tutorTeams.length > 0 && (
        <>
          <div className="text-lg">Вы - тьютор в:</div>

          <div className="flex flex-col gap-3 my-3">
            {tutorTeams.map((team) => (
              <div key={team.id}>
                <div
                  className="text-lg font-bold transition duration-200 ease-in-out cursor-pointer text-black_2 hover:bg-another_white py-1.5 px-2 rounded-xl"
                  onClick={() => {
                    if (currentTeam?.id !== team.id) {
                      onTeamButtonClick(team.id);
                    }
                  }}
                >
                  {team.name}
                </div>

                {currentTeam?.id === team.id && (
                  <>
                    <div className="flex flex-col gap-4 my-3">
                      <SidebarLink to="team-overview" text="Просмотр команды" />
                      <SidebarLink to="kanban" text="Ведение задач" />
                      <SidebarLink
                        to="educationRequests"
                        text="Образовательные запросы"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <PrimaryButton
        className="mt-3"
        children="Вернуться к списку интенсивов"
        clickHandler={returnToIntensivesClickHandler}
      />
    </>
  );
};

export default TeacherSidebarContent;
