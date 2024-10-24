import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useLazyGetTeamsQuery } from '../redux/api/teamApi';
import { useLazyGetTeachersOnIntensiveQuery } from '../redux/api/teacherApi';
import { useLazyGetNotAssignedStudentsQuery } from '../redux/api/studentApi';

import DragContainer from '../components/DragComponents/DragContainer';
import DragElement from '../components/DragComponents/DragElement';
import Title from '../components/Title';
import TeamIcon from '../components/icons/TeamIcon';
import SearchIcon from '../components/icons/SearchIcon';

import { ITeamForManager } from '../ts/interfaces/ITeam';
import { ITeacher } from '../ts/interfaces/ITeacher';
import { IStudent } from '../ts/interfaces/IStudent';

const CreateSupportTeamsPage: FC = () => {
  const { intensiveId } = useParams();

  const [getTeams] = useLazyGetTeamsQuery();
  const [getTeachersOnIntensive] = useLazyGetTeachersOnIntensiveQuery();
  const [getNotAssignedStudentsOnIntensive] =
    useLazyGetNotAssignedStudentsQuery();

  const [teams, setTeams] = useState<ITeamForManager[]>([]);
  const [currentTeam, setCurrentTeam] = useState<ITeamForManager>();

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
            setCurrentTeam(data[0]);
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
    setCurrentTeam(
      teams.find((team) => team.index.toString() === event.target.value)
    );
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
              value={currentTeam?.index.toString()}
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
            <div>
              {currentTeam && (
                <>
                  <div className="text-lg font-bold text-black">
                    {currentTeam.name}
                  </div>

                  <p className="text-base text-bright_gray mt-2.5 max-w-[380px]">
                    Для добавления наставника и тьютора в команду выберите их из
                    списка справа
                  </p>

                  <div className="mt-2.5 flex gap-4">
                    <TeamIcon />
                    <div className="flex flex-col gap-1.5">
                      <div className="text-lg text-black">
                        {currentTeam.name}
                      </div>
                      <div className="text-bright_gray">Нет тьютора</div>
                      <div className="text-bright_gray">Нет наставника</div>
                      {currentTeam.studentsInTeam.length > 0 ? (
                        <div className="flex flex-col gap-1.5">
                          {currentTeam.studentsInTeam.map((studentInTeam) => (
                            <div
                              key={studentInTeam.id}
                              className="flex items-center gap-3 px-3 py-1 text-base rounded-xl bg-gray_5 hover:bg-gray_6"
                            >
                              {studentInTeam.nameWithGroup}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-bright_gray">Нет участников</div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col items-center">
              <div className="text-lg font-bold text-black">
                Тьюторы и наставники
              </div>

              <div className="flex justify-between mt-6 min-w-[266px] border-solid border-b border-b-black pb-2 text-lg">
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
                {/* TODO: заменить на DragElement */}
                {/* DragElement тоже сделать generic компонентом? */}
                {slug === 'tutors' ? (
                  <>
                    {allTeachers.map((teacher) => (
                      <DragElement
                        key={teacher.id}
                        data={{
                          id: teacher.id,
                          content: teacher.name,
                        }}
                      />
                    ))}
                  </>
                ) : (
                  <>
                    {' '}
                    {allStudents.map((student) => (
                      <DragElement
                        key={student.id}
                        data={{
                          id: student.id,
                          content: student.nameWithGroup,
                        }}
                      />
                    ))}{' '}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CreateSupportTeamsPage;
