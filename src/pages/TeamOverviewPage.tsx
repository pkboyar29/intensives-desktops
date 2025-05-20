import { FC, useState, useEffect } from 'react';
import { useAppSelector } from '../redux/store';
import { useAppDispatch } from '../redux/store';
import { isUserTeacher, isUserTeamlead } from '../helpers/userHelpers';

import {
  useChangeTeamleadMutation,
  useChangeStudentRolesMutation,
} from '../redux/api/teamApi';
import { setTeam } from '../redux/slices/teamSlice';

import { IStudentInTeam } from '../ts/interfaces/ITeam';
import { IStudentRole } from '../ts/interfaces/IStudentRole';

import { Helmet } from 'react-helmet-async';
import Title from '../components/common/Title';
import Skeleton from 'react-loading-skeleton';
import PrimaryButton from '../components/common/PrimaryButton';
import Tag from '../components/common/Tag';
import { ToastContainer, toast } from 'react-toastify';

const TeamOverviewPage: FC = () => {
  const currentTeam = useAppSelector((state) => state.team.data);
  const currentIntensive = useAppSelector((state) => state.intensive.data);
  const currentUser = useAppSelector((state) => state.user.data);

  const dispatch = useAppDispatch();

  const [changeTeamlead] = useChangeTeamleadMutation();
  const [changeStudentRoles] = useChangeStudentRolesMutation();

  const [changeMode, setChangeMode] = useState<boolean>(false);

  const [isRolesEditing, setIsRolesEditing] = useState(false);

  const [currentTeamleadId, setCurrentTeamleadId] = useState<number | null>(
    null
  );
  const [currentStudentsInTeam, setCurrentStudentsInTeam] = useState<
    IStudentInTeam[]
  >([]);

  useEffect(() => {
    if (currentTeam) {
      setCurrentTeamleadId(
        currentTeam.teamlead ? currentTeam.teamlead.id : null
      );
    }
  }, [currentTeam]);

  useEffect(() => {
    if (currentTeam) {
      setCurrentStudentsInTeam(currentTeam.studentsInTeam);
    }
  }, [currentTeam]);

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

    setIsRolesEditing(true);
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

    setIsRolesEditing(true);
  };

  const onSubmit = async () => {
    if (currentTeam) {
      try {
        // если тимлид изменился, то отправляем запрос на его изменение
        if (currentTeam?.teamlead?.id != currentTeamleadId) {
          await changeTeamleadSubmit();
        }

        if (isRolesEditing) {
          await changeRolesSubmit();

          setIsRolesEditing(false);
        }

        dispatch(
          setTeam({
            ...currentTeam,
            teamlead:
              currentTeamleadId === null
                ? null
                : {
                    ...(
                      currentTeam.studentsInTeam.find(
                        (studentInTeam) =>
                          studentInTeam.student.id === currentTeamleadId
                      ) as IStudentInTeam
                    ).student,
                  },
            studentsInTeam: currentStudentsInTeam,
          })
        );

        setChangeMode(false);
      } catch (e) {
        if (e instanceof Error) {
          if (e.message == 'teamlead') {
            toast('Произошла серверная ошибка при изменении тимлида', {
              type: 'error',
            });

            setCurrentTeamleadId(
              currentTeam.teamlead ? currentTeam.teamlead.id : null
            );
            setCurrentStudentsInTeam(currentTeam.studentsInTeam);
          } else {
            toast('Произошла серверная ошибка при изменении ролей', {
              type: 'error',
            });

            setCurrentTeamleadId(
              currentTeam.teamlead ? currentTeam.teamlead.id : null
            );
            setCurrentStudentsInTeam(currentTeam.studentsInTeam);
          }
        }
      }
    }
  };

  const changeTeamleadSubmit = async () => {
    if (currentTeam) {
      const { data: responseData, error: responseError } = await changeTeamlead(
        {
          teamId: currentTeam.id,
          teamleadId: currentTeamleadId,
        }
      );

      if (responseData) {
        toast('Тимлид был успешно изменен', {
          type: 'success',
        });
      }

      if (responseError) {
        throw new Error('teamlead');
      }
    }
  };

  const changeRolesSubmit = async () => {
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
          type: 'success',
        });
      }

      if (responseError) {
        throw new Error('roles');
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {currentIntensive &&
            currentTeam &&
            `${currentTeam.name} | ${currentIntensive.name}`}
        </title>
      </Helmet>

      <ToastContainer position="top-center" />

      {!currentTeam ? (
        <Skeleton />
      ) : (
        <>
          <Title text={currentTeam.name} />

          <div className="mt-5">
            <div className="flex flex-col gap-5">
              {currentTeam.studentsInTeam.length > 0 ? (
                <div className="flex flex-col gap-3 sm:gap-5 sm:items-center sm:flex-row">
                  <div className="font-sans text-xl font-bold text-black">
                    Участники команды
                  </div>

                  {(isUserTeacher(currentUser) ||
                    isUserTeamlead(currentUser, currentTeam)) && (
                    <>
                      {!changeMode ? (
                        <div>
                          <PrimaryButton
                            onClick={() => {
                              setChangeMode(true);
                            }}
                          >
                            Изменить роли в команде
                          </PrimaryButton>
                        </div>
                      ) : (
                        <div>
                          <PrimaryButton onClick={onSubmit}>
                            Сохранить изменения
                          </PrimaryButton>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="text-xl font-bold text-black">
                  В команде нету участников
                </div>
              )}

              <div className="flex flex-col gap-4">
                {currentStudentsInTeam?.map((studentInTeam) => (
                  <div key={studentInTeam.student.id}>
                    <div className="font-sans text-base text-bright_gray">
                      {studentInTeam.student.group.name}
                      {'  '}
                      {studentInTeam.student.user.lastName}{' '}
                      {studentInTeam.student.user.firstName}{' '}
                      {studentInTeam.student.user.patronymic}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3 ml-3">
                      {studentInTeam.roles.length === 0 &&
                        studentInTeam.student.id != currentTeamleadId && (
                          <div className="font-bold">Нет ролей</div>
                        )}

                      {studentInTeam.student.id == currentTeamleadId && (
                        <div>
                          <Tag
                            content={<div className="font-bold">Тимлид</div>}
                            shouldHaveCrossIcon={
                              changeMode && isUserTeacher(currentUser)
                            }
                            deleteHandler={() => setCurrentTeamleadId(null)}
                          />
                        </div>
                      )}

                      {studentInTeam.roles.map((role) => (
                        <div key={role.id}>
                          <Tag
                            content={role.name}
                            shouldHaveCrossIcon={changeMode}
                            deleteHandler={() =>
                              handleRoleCrossClick(
                                studentInTeam.student.id,
                                role.id
                              )
                            }
                          />
                        </div>
                      ))}

                      {changeMode && (
                        <select
                          onChange={(e) => {
                            if (e.target.value === 'teamlead') {
                              setCurrentTeamleadId(studentInTeam.student.id);
                              return;
                            }

                            handleRoleSelectChange(
                              studentInTeam.student.id,
                              currentIntensive?.roles.find(
                                (role) => role.id === Number(e.target.value)
                              )!
                            );
                          }}
                          value=""
                          className="px-3 py-1 text-base bg-gray_5 rounded-xl"
                        >
                          <option value="">Добавить роль</option>

                          {!currentTeamleadId && (
                            <option value="teamlead" className="font-bold">
                              Тимлид
                            </option>
                          )}

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

              <h2 className="font-sans text-xl font-bold text-black">
                Команда сопровождения
              </h2>

              <div>
                <h2 className="font-sans text-xl font-bold text-black">
                  Наставник
                </h2>
                <div className="mt-2 font-sans text-base text-bright_gray">
                  {currentTeam.mentor
                    ? `${currentTeam.mentor.group.name} ${currentTeam.mentor.user.lastName} ${currentTeam.mentor.user.firstName} ${currentTeam.mentor.user.patronymic}`
                    : 'Нету'}
                </div>
              </div>

              <div>
                <h2 className="font-sans text-xl font-bold text-black">
                  Тьютор
                </h2>
                <div className="mt-2 font-sans text-base text-bright_gray">
                  {currentTeam.tutor
                    ? `${currentTeam.tutor.user.lastName} ${currentTeam.tutor.user.firstName} ${currentTeam.tutor.user.patronymic}`
                    : 'Нету'}
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
