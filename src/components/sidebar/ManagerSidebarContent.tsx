import { FC, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { useLazyGetTeamQuery } from '../../redux/api/teamApi';
import { useUpdateIntensiveOpennessMutation } from '../../redux/api/intensiveApi';
import { resetIntensiveState } from '../../redux/slices/intensiveSlice';
import { resetTeamState, setTeam } from '../../redux/slices/teamSlice';
import { setIsSidebarOpen } from '../../redux/slices/windowSlice';
import { useWindowSize } from '../../helpers/useWindowSize';

import SwitchButton from '../common/SwitchButton';
import Skeleton from 'react-loading-skeleton';
import SidebarLink from './SidebarLink';
import PrimaryButton from '../common/PrimaryButton';

const ManagerSidebarContent: FC<{ isIntensiveLoading: boolean }> = ({
  isIntensiveLoading,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const { width: windowWidth } = useWindowSize();

  const [getTeam] = useLazyGetTeamQuery();
  const [updateOpenness] = useUpdateIntensiveOpennessMutation();

  const currentTeam = useAppSelector((state) => state.team.data);
  const currentIntensive = useAppSelector((state) => state.intensive.data);

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

  useEffect(() => {
    if (windowWidth < 768) {
      dispatch(setIsSidebarOpen(false));
    }
  }, [pathname]);

  const updateIntensiveOpenness = (isOpen: boolean) => {
    if (currentIntensive) {
      if (isOpen !== currentIntensive.isOpen) {
        updateOpenness({
          openness: isOpen,
          intensiveId: currentIntensive.id,
        });
      }
    }
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
      {!pathname.includes('editIntensive') && (
        <div className="mt-3">
          <SwitchButton
            leftSideText="Видим"
            rightSideText="Невидим"
            currentSide={currentIntensive?.isOpen ? 'left' : 'right'}
            onSideClick={(side) =>
              updateIntensiveOpenness(side === 'left' ? true : false)
            }
          />
        </div>
      )}
      <div className="flex flex-col gap-4 mt-5 mb-3">
        <SidebarLink
          to="overview"
          text="Просмотр интенсива"
          className={`${pathname.includes('/editIntensive') && 'active'}`}
        />
        <SidebarLink
          to="teams"
          text="Управление командами"
          className={`${
            (pathname.includes('/createTeams') ||
              pathname.includes('/createSupportTeams')) &&
            'active'
          }`}
        />
        <SidebarLink to="schedule" text="Управление расписанием" />
        <SidebarLink to="educationRequests" text="Образовательные запросы" />
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

export default ManagerSidebarContent;
