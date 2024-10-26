import { FC, useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useLazyGetTeamsQuery } from '../redux/api/teamApi';
import { useLazyGetTeachersOnIntensiveQuery } from '../redux/api/teacherApi';
import { useLazyGetNotAssignedStudentsQuery } from '../redux/api/studentApi';

import SupportTeamDragContainer from '../components/DragComponents/SupportTeamDragContainer';
import SupportTeamDragElement from '../components/DragComponents/SupportTeamDragElement';
import PrimaryButton from '../components/PrimaryButton';
import Title from '../components/Title';
import SearchIcon from '../components/icons/SearchIcon';

import { ITeamForManager } from '../ts/interfaces/ITeam';
import { ITeacher } from '../ts/interfaces/ITeacher';
import { IStudent } from '../ts/interfaces/IStudent';

const CreateSupportTeamsPage: FC = () => {
  const navigate = useNavigate();
  const { intensiveId } = useParams();

  const [getTeams] = useLazyGetTeamsQuery();
  const [getTeachersOnIntensive] = useLazyGetTeachersOnIntensiveQuery();
  const [getNotAssignedStudentsOnIntensive] =
    useLazyGetNotAssignedStudentsQuery();

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
    console.log(newDroppedElement);

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

  const onSubmit = () => {
    console.log('hello submit');
  };

  return (
    <>
      <Title text="Команды сопровождения" />

      <p className="mt-3 text-base text-gray_3">
        Распределите наставников и тьюторов по командам
      </p>

      {teams.length <= 0 ? (
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
              <div className="flex flex-col gap-2">
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

            <div className="flex flex-col items-center">
              <div className="text-lg font-bold text-black">
                Тьюторы и наставники
              </div>

              <div className="relative flex justify-between mt-6 min-w-[266px] border-solid border-b border-b-black pb-2 text-lg">
                <button
                  onClick={() => setSlug('tutors')}
                  className={`transition-colors duration-300 cursor-pointer ${
                    slug === 'tutors' ? 'text-blue' : 'hover:text-blue'
                  }`}
                >
                  Тьюторы
                </button>
                <button
                  onClick={() => setSlug('mentors')}
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

              <div className="rounded-[10px] border border-dashed border-bright_gray py-3 px-6 flex flex-wrap gap-2 justify-center mt-3 max-w-[550px]">
                {slug === 'tutors' ? (
                  <>
                    {allTeachers.map((teacher) => (
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
                    {allStudents.map((student) => (
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
                    text="Отменить"
                    buttonColor="gray"
                    clickHandler={() => {
                      if (intensiveId) {
                        navigate(`/manager/${parseInt(intensiveId)}/teams`);
                      }
                    }}
                  />
                </div>
                <div>
                  <PrimaryButton text="Сохранить" clickHandler={onSubmit} />
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
