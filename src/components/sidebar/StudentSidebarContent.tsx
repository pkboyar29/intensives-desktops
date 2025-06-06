import { useEffect, FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { useLazyGetMyTeamQuery } from '../../redux/api/teamApi';
import { resetIntensiveState } from '../../redux/slices/intensiveSlice';
import { setIsSidebarOpen } from '../../redux/slices/windowSlice';
import { useWindowSize } from '../../helpers/useWindowSize';

import Skeleton from 'react-loading-skeleton';
import SidebarLink from './SidebarLink';
import PrimaryButton from '../common/PrimaryButton';

const StudentSidebarContent: FC<{ isIntensiveLoading: boolean }> = ({
  isIntensiveLoading,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const { width: windowWidth } = useWindowSize();

  const currentIntensive = useAppSelector((state) => state.intensive.data);
  const currentTeam = useAppSelector((state) => state.team.data);

  const [getMyTeam, { data, isLoading: isTeamLoading }] =
    useLazyGetMyTeamQuery();

  useEffect(() => {
    if (currentIntensive) {
      getMyTeam(currentIntensive.id);
    }
  }, [currentIntensive]);

  useEffect(() => {
    if (windowWidth < 768) {
      dispatch(setIsSidebarOpen(false));
    }
  }, [pathname]);

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
        {currentTeam && <SidebarLink to="schedule" text="Мероприятия" />}
        <SidebarLink to="results" text="Результат интенсива" />
      </div>
      <div className="my-3">
        {isTeamLoading ? (
          <Skeleton />
        ) : (
          currentTeam && (
            <>
              <div className="text-xl font-bold text-black_2">
                {currentTeam.name}
              </div>

              <div className="flex flex-col gap-4 my-3">
                <SidebarLink to="team-overview" text="Просмотр команды" />
                <SidebarLink to="kanban" text="Ведение задач" />
                <SidebarLink
                  to="educationRequests"
                  text="Образовательные запросы"
                />
              </div>
            </>
          )
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
