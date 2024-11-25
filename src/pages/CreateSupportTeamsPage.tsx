import { FC, useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  useLazyGetTeamsQuery,
  useUpdateSupportMembersMutation,
} from '../redux/api/teamApi';
import { useLazyGetTeachersOnIntensiveQuery } from '../redux/api/teacherApi';
import { useLazyGetNotAssignedStudentsQuery } from '../redux/api/studentApi';

import Modal from '../components/modals/Modal';
import SupportTeamDragContainer from '../components/DragComponents/SupportTeamDragContainer';
import SupportTeamDragElement from '../components/DragComponents/SupportTeamDragElement';
import PrimaryButton from '../components/PrimaryButton';
import Title from '../components/Title';
import SearchIcon from '../components/icons/SearchIcon';
import Skeleton from 'react-loading-skeleton';

import { ITeamForManager } from '../ts/interfaces/ITeam';
import { ITeacher } from '../ts/interfaces/ITeacher';
import { IStudent } from '../ts/interfaces/IStudent';

const CreateSupportTeamsPage: FC = () => {
  const navigate = useNavigate();
  const { intensiveId } = useParams();

  // все-таки вместо lazy хуков использовать нормальные?
  const [getTeams, { isLoading }] = useLazyGetTeamsQuery();
  const [getTeachersOnIntensive] = useLazyGetTeachersOnIntensiveQuery();
  const [getNotAssignedStudentsOnIntensive] =
    useLazyGetNotAssignedStudentsQuery();
  const [updateSupportMembers] = useUpdateSupportMembersMutation();

  const [teams, setTeams] = useState<ITeamForManager[]>([]);
  // предположить, что тут может быть рандомная цифра?
  const [currentTeamId, setCurrentTeamId] = useState<number>();
  const currentTeam = useMemo(
    () => teams.find((team) => team.index === currentTeamId),
    [teams, currentTeamId]
  );

  const [allTeachers, setAllTeachers] = useState<ITeacher[]>([]);
  const [allStudents, setAllStudents] = useState<IStudent[]>([]);

  const [searchString, setSearchString] = useState<string>('');

  const [slug, setSlug] = useState<'tutors' | 'mentors'>('tutors');

  const [cancelModal, setCancelModal] = useState<boolean>(false);
  const [saveModal, setSaveModal] = useState<boolean>(false);

  const searchInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        if (intensiveId) {
          const { data } = await getTeams(parseInt(intensiveId));

          if (data) {
            setTeams(data);
            setCurrentTeamId(data[0].id || undefined);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchTeachersTutors = async () => {
      try {
        if (intensiveId) {
          const { data } = await getTeachersOnIntensive(parseInt(intensiveId));

          if (data) {
            setAllTeachers(data);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchTeachersTutors();
  }, []);

  useEffect(() => {
    const fetchStudentsMentors = async () => {
      try {
        if (intensiveId) {
          const { data } = await getNotAssignedStudentsOnIntensive(
            parseInt(intensiveId)
          );

          if (data) {
            setAllStudents(data);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchStudentsMentors();
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentTeamId(parseInt(event.target.value));
  };

  const updateTeamSupportMembers = (
    currentTeamId: number,
    newDroppedElement: {
      id: number;
      content: string;
      isTutor: boolean;
    }
  ) => {
    setTeams((teams) =>
      teams.map((team) => {
        if (currentTeamId !== team.index) {
          return team;
        }

        const updatedTeam = { ...team };

        if (newDroppedElement.isTutor) {
          updatedTeam.tutor = {
            id: newDroppedElement.id,
            name: newDroppedElement.content,
            teacherId: 1, // избавиться от этого, например просто другой интерфейс оставить, где не будет teacherId
          };
        } else {
          updatedTeam.mentor = {
            id: newDroppedElement.id,
            nameWithGroup: newDroppedElement.content,
          };
        }

        return updatedTeam;
      })
    );
  };

  const deleteTeamSupportMember = (
    currentTeamId: number,
    deleteTutorOrMentor: boolean
  ) => {
    setTeams((teams) =>
      teams.map((team) => {
        if (currentTeamId !== team.index) {
          return team;
        }

        const updatedTeam = { ...team };

        if (deleteTutorOrMentor) {
          updatedTeam.tutor = null;
        } else {
          updatedTeam.mentor = null;
        }

        return updatedTeam;
      })
    );
  };

  const onSubmit = async () => {
    try {
      await updateSupportMembers(
        teams.map((team) => ({
          id: team.index,
          tutorId: team.tutor?.id || null,
          mentorId: team.mentor?.id || null,
        }))
      );

      setSaveModal(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {cancelModal && (
        <Modal
          title="Вы уверены, что хотите прекратить редактирование?"
          onCloseModal={() => setCancelModal(false)}
        >
          <p className="text-lg text-bright_gray">
            Вы уверены, что хотите прекратить редактирование? Все сделанные вами
            изменения не будут сохранены.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <div>
              <PrimaryButton
                buttonColor="gray"
                clickHandler={() => setCancelModal(false)}
                children="Продолжить редактирование"
              />
            </div>
            <div>
              <PrimaryButton
                clickHandler={() => {
                  setCancelModal(false);
                  if (intensiveId) {
                    navigate(`/manager/${intensiveId}/teams`);
                  }
                }}
                children="Да"
              />
            </div>
          </div>
        </Modal>
      )}

      {saveModal && (
        <Modal
          title="Команды сопровождения успешно обновлены"
          onCloseModal={() => {
            setSaveModal(false);
            if (intensiveId) {
              navigate(`/manager/${intensiveId}/teams`);
            }
          }}
        >
          <p className="text-lg text-bright_gray">
            Команды сопровождения успешно обновлены для каждой команды.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <div>
              <PrimaryButton
                clickHandler={() => {
                  setSaveModal(false);
                  if (intensiveId) {
                    navigate(`/manager/${intensiveId}/teams`);
                  }
                }}
                children="Закрыть"
              />
            </div>
          </div>
        </Modal>
      )}

      <Title text="Команды сопровождения" />

      <p className="mt-3 text-base text-gray_3">
        Распределите наставников и тьюторов по командам
      </p>

      {isLoading ? (
        <div className="mt-7">
          <Skeleton />
        </div>
      ) : teams.length <= 0 ? (
        <div className="text-xl font-bold text-black mt-7">
          Команды еще не определены для этого интенсива
        </div>
      ) : (
        <>
          <div className="mt-3">
            <div className="text-lg font-bold text-black">Выбор команды</div>

            <select
              onChange={handleSelectChange}
              value={currentTeamId}
              className="mt-3 bg-another_white rounded-xl p-2.5"
            >
              {teams.map((team) => (
                <option key={team.index} value={team.index.toString()}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-20 mt-8">
            {currentTeam && (
              <div className="flex flex-col gap-2 basis-1/3">
                <div className="text-lg font-bold text-black">
                  {currentTeam.name}
                </div>

                <p className="text-base text-bright_gray max-w-[380px]">
                  Для добавления наставника и тьютора в команду выберите их из
                  списка справа
                </p>

                <SupportTeamDragContainer
                  team={currentTeam}
                  onDrop={(newDroppedElement) => {
                    if (currentTeamId) {
                      updateTeamSupportMembers(
                        currentTeamId,
                        newDroppedElement
                      );
                    }
                  }}
                  onDelete={(deleteTutorOrMentor) => {
                    if (currentTeamId) {
                      deleteTeamSupportMember(
                        currentTeamId,
                        deleteTutorOrMentor
                      );
                    }
                  }}
                />
              </div>
            )}

            <div className="flex flex-col items-center grow basis-2/3">
              <div className="text-lg font-bold text-black">
                Тьюторы и наставники
              </div>

              <div className="relative flex justify-between mt-6 min-w-[266px] border-solid border-b border-b-black pb-2 text-lg">
                <button
                  onClick={() => {
                    setSearchString('');
                    setSlug('tutors');
                  }}
                  className={`transition-colors duration-300 cursor-pointer ${
                    slug === 'tutors' ? 'text-blue' : 'hover:text-blue'
                  }`}
                >
                  Тьюторы
                </button>
                <button
                  onClick={() => {
                    setSearchString('');
                    setSlug('mentors');
                  }}
                  className={`transition-colors duration-300 cursor-pointer ${
                    slug === 'mentors' ? 'text-blue' : 'hover:text-blue'
                  }`}
                >
                  Наставники
                </button>

                <div
                  className={`absolute bottom-[-2.5px] h-[4px] w-[35px] bg-blue rounded-2xl transition-all duration-300`}
                  style={{
                    left: slug === 'tutors' ? '0' : 'calc(100% - 35px)',
                  }}
                ></div>
              </div>

              <div className="relative flex items-center w-full mt-8">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Поиск"
                  className="w-full py-3 pl-12 pr-2 rounded-xl bg-another_white"
                  value={searchString}
                  onChange={searchInputChangeHandler}
                />
              </div>

              <div className="rounded-[10px] border border-dashed border-bright_gray py-3 px-6 flex flex-wrap gap-2 justify-center min-w-[550px] mt-3">
                {slug === 'tutors' ? (
                  <>
                    {allTeachers
                      .filter((teacher) =>
                        teacher.name
                          .toLowerCase()
                          .includes(searchString.toLowerCase())
                      )
                      .map((teacher) => (
                        <SupportTeamDragElement
                          key={teacher.id}
                          data={{
                            id: teacher.id,
                            content: teacher.name,
                            isTutor: true,
                          }}
                        />
                      ))}
                  </>
                ) : (
                  <>
                    {' '}
                    {allStudents
                      .filter((student) =>
                        student.nameWithGroup
                          .toLowerCase()
                          .includes(searchString.toLowerCase())
                      )
                      .map((student) => (
                        <SupportTeamDragElement
                          key={student.id}
                          data={{
                            id: student.id,
                            content: student.nameWithGroup,
                            isTutor: false,
                          }}
                        />
                      ))}{' '}
                  </>
                )}
              </div>

              <div className="flex justify-end w-full gap-3 mt-3">
                <div>
                  <PrimaryButton
                    children="Отменить"
                    buttonColor="gray"
                    clickHandler={() => {
                      setCancelModal(true);
                    }}
                  />
                </div>
                <div>
                  <PrimaryButton children="Сохранить" clickHandler={onSubmit} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CreateSupportTeamsPage;
