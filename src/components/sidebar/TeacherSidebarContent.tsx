import { useEffect, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { useLazyGetTeamQuery } from '../../redux/api/teamApi';
import { resetIntensiveState } from '../../redux/slices/intensiveSlice';
import { resetTeamState, setTeam } from '../../redux/slices/teamSlice';

import Skeleton from 'react-loading-skeleton';
import SidebarLink from './SidebarLink';
import PrimaryButton from '../common/PrimaryButton';

const TeacherSidebarContent: FC<{ isIntensiveLoading: boolean }> = ({
  isIntensiveLoading,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const currentTeam = useAppSelector((state) => state.team.data);
  const currentIntensive = useAppSelector((state) => state.intensive.data);

  const [getTeam] = useLazyGetTeamQuery();

  useEffect(() => {
    const fetchTeam = async () => {
      const currentTeam = Number(sessionStorage.getItem('currentTeam'));

      if (currentTeam) {
        const { data: team } = await getTeam(currentTeam);
        if (team) {
          dispatch(setTeam(team));
        }
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
    </>
  );
};

export default TeacherSidebarContent;
