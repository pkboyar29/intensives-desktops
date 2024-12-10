import { FC } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';

import { useGetIntensiveQuery } from '../../redux/api/intensiveApi';
import { useUpdateIntensiveMutation } from '../../redux/api/intensiveApi';

import { useAppDispatch, useAppSelector } from '../../redux/store';
import { resetIntensiveState } from '../../redux/slices/intensiveSlice';

import IntensiveNotFoundComponent from './components/IntensiveNotFoundComponent';
import Sidebar from './components/Sidebar';
import SidebarLink from './components/SidebarLink';
import PrimaryButton from '../../components/common/PrimaryButton';
import SwitchButton from '../../components/common/SwitchButton';
import Skeleton from 'react-loading-skeleton';

const ManagerMainPage: FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();

  const [updateIntensive] = useUpdateIntensiveMutation();

  const { isLoading, isError } = useGetIntensiveQuery(
    Number(params.intensiveId),
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const currentIntensive = useAppSelector((state) => state.intensive.data);

  const returnToIntensivesClickHandler = () => {
    dispatch(resetIntensiveState());
    navigate(`/intensives`);
  };

  const updateIntensiveOpenness = (isOpen: boolean) => {
    if (currentIntensive) {
      if (isOpen !== currentIntensive.isOpen) {
        updateIntensive({
          name: currentIntensive.name,
          description: currentIntensive.description,
          openDate: currentIntensive.openDate.toISOString(),
          closeDate: currentIntensive.closeDate.toISOString(),
          id: currentIntensive.id,
          flowIds: currentIntensive.flows.map((flow) => flow.id),
          teacherIds: currentIntensive.teachers.map((teacher) => teacher.id),
          roleIds: currentIntensive.roles.map((role) => role.id),
          isOpen,
        });
      }
    }
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

              <div className="mt-3">
                <SwitchButton
                  leftSideText="Открыт"
                  rightSideText="Закрыт"
                  currentSide={currentIntensive?.isOpen ? 'left' : 'right'}
                  onSideClick={(side) =>
                    updateIntensiveOpenness(side === 'left' ? true : false)
                  }
                />
              </div>

              <div className="flex flex-col gap-4 mt-5 mb-3">
                <SidebarLink to="overview" text="Настройки интенсива" />
                <SidebarLink to="teams" text="Управление командами" />
                <SidebarLink to="schedule" text="Управление расписанием" />
                <SidebarLink to="statistics" text="Статистика" />
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
