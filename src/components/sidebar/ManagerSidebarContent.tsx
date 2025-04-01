import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { useUpdateIntensiveMutation } from '../../redux/api/intensiveApi';
import { resetIntensiveState } from '../../redux/slices/intensiveSlice';

import SwitchButton from '../common/SwitchButton';
import Skeleton from 'react-loading-skeleton';
import SidebarLink from './SidebarLink';
import PrimaryButton from '../common/PrimaryButton';

const ManagerSidebarContent: FC<{ isIntensiveLoading: boolean }> = ({
  isIntensiveLoading,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const currentIntensive = useAppSelector((state) => state.intensive.data);

  const [updateIntensive] = useUpdateIntensiveMutation();

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
          specificStudentsIds: currentIntensive.specificStudents.map(
            (student) => student.id
          ),
          teacherIds: currentIntensive.teachers.map((teacher) => teacher.id),
          roleIds: currentIntensive.roles.map((role) => role.id),
          isOpen,
        });
      }
    }
  };

  const returnToIntensivesClickHandler = () => {
    dispatch(resetIntensiveState());
    navigate(`/intensives`);
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
    </>
  );
};

export default ManagerSidebarContent;
