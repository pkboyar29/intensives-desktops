import { FC, useState, useEffect } from 'react';
import { useAppSelector } from '../redux/store';
import { useAppDispatch } from '../redux/store';

import {
  useChangeTeamleadMutation,
  useChangeStudentRolesMutation,
} from '../redux/api/teamApi';
import { setTeam } from '../redux/slices/teamSlice';

import { IStudentInTeam } from '../ts/interfaces/ITeam';
import { IStudentRole } from '../ts/interfaces/IStudentRole';

import Title from '../components/common/Title';
import Skeleton from 'react-loading-skeleton';
import PrimaryButton from '../components/common/PrimaryButton';
import Tag from '../components/common/Tag';
import { ToastContainer, toast } from 'react-toastify';

// если студентов в команде не будет, как все это будет отображаться

const TeamOverviewPage: FC = () => {
  const currentTeam = useAppSelector((state) => state.team.data);
  const currentIntensive = useAppSelector((state) => state.intensive.data);
  const currentUser = useAppSelector((state) => state.user.data);

  const [isAllowedToChangeStudentRoles, setIsAllowedToChangeStudentRoles] =
    useState<boolean>(false);
  const [isAllowedToChangeTeamlead, setIsAllowedToChangeTeamlead] =
    useState<boolean>(false);

  const dispatch = useAppDispatch();

  const [changeTeamlead] = useChangeTeamleadMutation();
  const [changeStudentRoles] = useChangeStudentRolesMutation();

  const [changeTeamleadMode, setChangeTeamleadMode] = useState<boolean>(false);
  const [currentTeamleadId, setCurrentTeamleadId] = useState<number>(0);

  const [currentStudentsInTeam, setCurrentStudentsInTeam] = useState<
    IStudentInTeam[]
  >([]);
  const [saveRoleAssignmentMode, setSaveRoleAssignmentMode] =
    useState<boolean>(false);

  useEffect(() => {
    if (currentTeam) {
      setCurrentTeamleadId(currentTeam.teamlead ? currentTeam.teamlead.id : 0);
    }
  }, [currentTeam]);

  useEffect(() => {
    if (currentTeam) {
      setCurrentStudentsInTeam(currentTeam.studentsInTeam);
    }
  }, [currentTeam]);

  useEffect(() => {
    if (currentUser && currentTeam) {
      // TODO: когда появится текущая роль, то сравнивать ее
      if (currentUser.roles.includes('Преподаватель')) {
        setIsAllowedToChangeStudentRoles(true);
        setIsAllowedToChangeTeamlead(true);
      }
      if (currentUser.roles.includes('Студент')) {
        if (currentUser.studentId === currentTeam.teamlead?.id) {
          setIsAllowedToChangeStudentRoles(true);
        }
      }
    }
  }, [currentUser, currentTeam]);

  const handleTeamleadSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurrentTeamleadId(Number(event.target.value));
  };

  const handleRoleSelectChange = (studentId: number, role: IStudentRole) => {
    const newCurrentStudentsInTeam: IStudentInTeam[] =
      currentStudentsInTeam.map((studentInTeam) => {
        if (studentInTeam.student.id === studentId) {
          return {
            student: studentInTeam.student,
            roles: [...studentInTeam.roles, role],
          };
        } else {
          return studentInTeam;
        }
      });
    setCurrentStudentsInTeam(newCurrentStudentsInTeam);

    if (!saveRoleAssignmentMode) {
      setSaveRoleAssignmentMode(true);
    }
  };

  const handleRoleCrossClick = (studentId: number, roleId: number) => {
    const newCurrentStudentsInTeam: IStudentInTeam[] =
      currentStudentsInTeam.map((studentInTeam) => {
        if (studentInTeam.student.id === studentId) {
          return {
            student: studentInTeam.student,
            roles: studentInTeam.roles.filter((role) => role.id !== roleId),
          };
        } else {
          return studentInTeam;
        }
      });
    setCurrentStudentsInTeam(newCurrentStudentsInTeam);

    if (!saveRoleAssignmentMode) {
      setSaveRoleAssignmentMode(true);
    }
  };

  const onChangeTeamleadSubmit = async () => {
    if (currentTeam) {
      const { data: responseData, error: responseError } = await changeTeamlead(
        {
          teamId: currentTeam.id,
          teamleadId: currentTeamleadId === 0 ? null : currentTeamleadId,
        }
      );

      if (responseData) {
        toast('Тимлид был успешно изменен', {
          type: 'info',
        });

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
                        (studentInTeam) =>
                          studentInTeam.student.id === currentTeamleadId
                      ) as IStudentInTeam
                    ).student.nameWithGroup,
                  },
          })
        );

        setChangeTeamleadMode(false);
      }

      if (responseError) {
        toast('Произошла серверная ошибка', {
          type: 'error',
        });
      }
    }
  };

  const onChangeStudentRolesSubmit = async () => {
    if (currentTeam) {
      const { data: responseData, error: responseError } =
        await changeStudentRoles({
          teamId: currentTeam.id,
          studentsInTeam: currentStudentsInTeam.map((studentInTeam) => ({
            studentId: studentInTeam.student.id,
            roleIds: studentInTeam.roles.map((role) => role.id),
          })),
        });

      if (responseData) {
        toast('Роли студентов были успешно изменены', {
          type: 'info',
        });

        dispatch(
          setTeam({
            ...currentTeam,
            studentsInTeam: currentStudentsInTeam,
          })
        );
        setSaveRoleAssignmentMode(false);
      }

      if (responseError) {
        toast('Произошла серверная ошибка', {
          type: 'error',
        });
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />

      {!currentTeam ? (
        <Skeleton />
      ) : (
        <>
          <Title text={currentTeam.name} />

          <div className="mt-5">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-5">
                <div className="font-sans text-xl font-bold text-black">
                  Участники команды
                </div>

                {saveRoleAssignmentMode && (
                  <div>
                    <PrimaryButton onClick={onChangeStudentRolesSubmit}>
                      Сохранить распределение ролей
                    </PrimaryButton>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {currentStudentsInTeam?.map((studentInTeam) => (
                  <div key={studentInTeam.student.id}>
                    <div className="font-sans text-base text-bright_gray">
                      {studentInTeam.student.nameWithGroup}
                    </div>

                    <div className="flex items-center gap-3 mt-3 ml-3">
                      {studentInTeam.roles.length > 0
                        ? studentInTeam.roles.map((role) => (
                            <div key={role.id} className="w-fit">
                              <Tag
                                content={role.name}
                                shouldHaveCrossIcon={
                                  isAllowedToChangeStudentRoles
                                }
                                deleteHandler={() =>
                                  handleRoleCrossClick(
                                    studentInTeam.student.id,
                                    role.id
                                  )
                                }
                              />
                            </div>
                          ))
                        : 'Нету ролей'}

                      {isAllowedToChangeStudentRoles && (
                        <select
                          onChange={(e) =>
                            handleRoleSelectChange(
                              studentInTeam.student.id,
                              currentIntensive?.roles.find(
                                (role) => role.id === Number(e.target.value)
                              )!
                            )
                          }
                          value=""
                          className="px-3 py-1 text-base bg-gray_5 rounded-xl"
                        >
                          <option value="">Добавить роль</option>
                          {currentIntensive?.roles
                            .filter(
                              (role) =>
                                !studentInTeam.roles
                                  .map((role) => role.id)
                                  .includes(role.id)
                            )
                            .map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ))}
                        </select>
                      )}
                    </div>
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
                        onChange={handleTeamleadSelectChange}
                        value={currentTeamleadId}
                        className="p-1.5 bg-gray_5 rounded-xl"
                      >
                        <option value={0}>Нету</option>
                        {currentTeam.studentsInTeam.map((studentInTeam) => (
                          <option
                            key={studentInTeam.student.id}
                            value={studentInTeam.student.id}
                          >
                            {studentInTeam.student.nameWithGroup}
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
                      {isAllowedToChangeTeamlead && (
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
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TeamOverviewPage;
