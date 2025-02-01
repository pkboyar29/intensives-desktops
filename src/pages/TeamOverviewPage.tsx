import { FC, useState, useEffect } from 'react';
import { useAppSelector } from '../redux/store';
import { useAppDispatch } from '../redux/store';

import { useChangeTeamleadMutation } from '../redux/api/teamApi';
import { setTeam } from '../redux/slices/teamSlice';

import { IStudent } from '../ts/interfaces/IStudent';

import Title from '../components/common/Title';
import OverviewContent from '../components/OverviewContent';
import Skeleton from 'react-loading-skeleton';
import PrimaryButton from '../components/common/PrimaryButton';

// если студентов в команде не будет, как все это будет отображаться

const TeamOverviewPage: FC = () => {
  const currentTeam = useAppSelector((state) => state.team.data);
  const currentUser = useAppSelector((state) => state.user.data);

  const dispatch = useAppDispatch();

  const [changeTeamlead] = useChangeTeamleadMutation();
  const [changeTeamleadMode, setChangeTeamleadMode] = useState<boolean>(false);
  const [currentTeamleadId, setCurrentTeamleadId] = useState<number>(0);

  useEffect(() => {
    if (currentTeam) {
      setCurrentTeamleadId(currentTeam.teamlead ? currentTeam.teamlead.id : 0);
    }
  }, [currentTeam]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentTeamleadId(Number(event.target.value));
  };

  const onChangeTeamleadSubmit = () => {
    if (currentTeam) {
      // TODO: отображать серверные ошибки
      changeTeamlead({
        teamId: currentTeam.index,
        teamleadId: currentTeamleadId === 0 ? null : currentTeamleadId,
      });

      // TODO: все последующее делать только при успешном запросе?
      dispatch(
        setTeam({
          ...currentTeam,
          teamlead:
            currentTeamleadId === 0
              ? null
              : {
                  id: currentTeamleadId,
                  nameWithGroup: (
                    currentTeam.studentsInTeam.find(
                      (student) => student.id === currentTeamleadId
                    ) as IStudent
                  ).nameWithGroup,
                },
        })
      );
    }

    setChangeTeamleadMode(false);
  };

  return (
    <>
      {!currentTeam ? (
        <Skeleton />
      ) : (
        <>
          <Title text={currentTeam.name} />

          <div className="mt-5">
            <OverviewContent>
              <div className="font-sans text-xl font-bold text-black">
                Участники команды
              </div>
              <div className="flex flex-col gap-2">
                {currentTeam.studentsInTeam.map((studentInTeam) => (
                  <div
                    className="font-sans text-base text-bright_gray"
                    key={studentInTeam.id}
                  >
                    {studentInTeam.nameWithGroup}
                  </div>
                ))}
              </div>

              <div>
                <h2 className="font-sans text-xl font-bold text-black">
                  Тимлид
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  {changeTeamleadMode === true ? (
                    <>
                      <select
                        onChange={handleSelectChange}
                        value={currentTeamleadId}
                        className="p-1.5 bg-another_white rounded-xl"
                      >
                        <option value={0}>Нету</option>
                        {currentTeam.studentsInTeam.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.nameWithGroup}
                          </option>
                        ))}
                      </select>
                      <div>
                        <PrimaryButton onClick={onChangeTeamleadSubmit}>
                          Сохранить изменения
                        </PrimaryButton>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-sans text-base text-bright_gray">
                        {currentTeam.teamlead
                          ? currentTeam.teamlead.nameWithGroup
                          : 'Нету'}
                      </div>
                      {currentUser?.roleNames.includes('Преподаватель') && (
                        <div>
                          <PrimaryButton
                            buttonColor="gray"
                            onClick={() => setChangeTeamleadMode(true)}
                          >
                            Изменить тимлида
                          </PrimaryButton>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div>
                <h2 className="font-sans text-xl font-bold text-black">
                  Наставник
                </h2>
                <div className="mt-2 font-sans text-base text-bright_gray">
                  {currentTeam.mentor
                    ? currentTeam.mentor.nameWithGroup
                    : 'Нету'}
                </div>
              </div>

              <div>
                <h2 className="font-sans text-xl font-bold text-black">
                  Тьютор
                </h2>
                <div className="mt-2 font-sans text-base text-bright_gray">
                  {currentTeam.tutor ? currentTeam.tutor.name : 'Нету'}
                </div>
              </div>
            </OverviewContent>
          </div>
        </>
      )}
    </>
  );
};

export default TeamOverviewPage;
