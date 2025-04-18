import { useEffect, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { useLazyGetMyTeamQuery } from '../../redux/api/teamApi';
import { resetIntensiveState } from '../../redux/slices/intensiveSlice';

import Skeleton from 'react-loading-skeleton';
import SidebarLink from './SidebarLink';
import PrimaryButton from '../common/PrimaryButton';

const StudentSidebarContent: FC<{ isIntensiveLoading: boolean }> = ({
  isIntensiveLoading,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const currentIntensive = useAppSelector((state) => state.intensive.data);
  const currentTeam = useAppSelector((state) => state.team.data);

  const [getMyTeam, { isLoading: isTeamLoading }] = useLazyGetMyTeamQuery();

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
      {' '}
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
              <SidebarLink
                to="educationRequests"
                text="Образовательные запросы"
              />
            </div>
          </>
        )}
      </div>
      <PrimaryButton
        children="Вернуться к списку интенсивов"
        clickHandler={returnToIntensivesClickHandler}
      />
    </>
  );
};

export default StudentSidebarContent;
