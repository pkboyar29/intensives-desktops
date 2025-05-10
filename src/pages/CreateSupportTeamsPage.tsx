import { FC, useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/store';

import {
  useLazyGetTeamsQuery,
  useUpdateSupportMembersMutation,
} from '../redux/api/teamApi';
import { useLazyGetSpecificFreeStudentsQuery } from '../redux/api/intensiveApi';

import { Helmet } from 'react-helmet-async';
import Modal from '../components/common/modals/Modal';
import SupportTeamDragContainer from '../components/DragComponents/SupportTeamDragContainer';
import SupportTeamDragElement from '../components/DragComponents/SupportTeamDragElement';
import PrimaryButton from '../components/common/PrimaryButton';
import Title from '../components/common/Title';
import SearchIcon from '../components/icons/SearchIcon';
import Skeleton from 'react-loading-skeleton';
import { ToastContainer, toast } from 'react-toastify';

import { ISupportTeamForManager, ITeam } from '../ts/interfaces/ITeam';

const CreateSupportTeamsPage: FC = () => {
  const navigate = useNavigate();
  const { intensiveId } = useParams();

  const currentIntensive = useAppSelector((state) => state.intensive.data);

  const [getTeams, { isLoading }] = useLazyGetTeamsQuery();
  const [updateSupportMembers] = useUpdateSupportMembersMutation();
  const [getSpecificFreeStudents] = useLazyGetSpecificFreeStudentsQuery();

  const [supportTeams, setSupportTeams] = useState<ISupportTeamForManager[]>(
    []
  );
  const [currentTeamId, setCurrentTeamId] = useState<number>();
  const currentTeam = useMemo(
    () => supportTeams.find((team) => team.id === currentTeamId),
    [supportTeams, currentTeamId]
  );

  interface ElementType {
    id: number;
    name: string;
  }

  const [allStudents, setAllStudents] = useState<ElementType[]>([]);
  const [allTeachers, setAllTeachers] = useState<ElementType[]>([]);

  const [searchString, setSearchString] = useState<string>('');

  const [slug, setSlug] = useState<'tutors' | 'mentors'>('tutors');

  const [cancelModal, setCancelModal] = useState<boolean>(false);
  const [saveModal, setSaveModal] = useState<boolean>(false);

  const searchInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  useEffect(() => {
    const fetchTeams = async () => {
      if (intensiveId) {
        const { data, error } = await getTeams({
          intensiveId: parseInt(intensiveId),
          short: false,
        });

        if (data) {
          setSupportTeams(
            (data as ITeam[]).map((team) => ({
              ...team,
              mentor: team.mentor
                ? { id: team.mentor.id, name: team.mentor.nameWithGroup }
                : null,
              tutor: team.tutor
                ? { id: team.tutor.id, name: team.tutor.name }
                : null,
            }))
          );
          setCurrentTeamId(data[0].id || undefined);
        }

        if (error) {
          console.log(error);
        }
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchSpecificFreeStudents = async () => {
      if (intensiveId) {
        const { data, error } = await getSpecificFreeStudents(
          parseInt(intensiveId)
        );

        if (data) {
          setAllStudents(
            data.map((s) => ({
              id: s.id,
              name: s.nameWithGroup,
            }))
          );
        }

        if (error) {
          console.log(error);
        }
      }
    };

    fetchSpecificFreeStudents();
  }, []);

  useEffect(() => {
    if (currentIntensive) {
      setAllTeachers(
        currentIntensive.teachers.map((t) => ({ id: t.id, name: t.name }))
      );
    }
  }, [currentIntensive]);

  const onTutorSlugClick = () => {
    setSearchString('');
    setSlug('tutors');
  };

  const onMentorSlugClick = () => {
    setSearchString('');
    setSlug('mentors');
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentTeamId(Number(event.target.value));
  };

  const updateTeamSupportMembers = (
    currentTeamId: number,
    newDroppedElement: {
      id: number;
      content: string;
      isTutor: boolean;
    }
  ) => {
    setSupportTeams((teams) =>
      teams.map((team) => {
        if (currentTeamId !== team.id) {
          return team;
        }

        const updatedTeam = { ...team };

        if (newDroppedElement.isTutor) {
          updatedTeam.tutor = {
            id: newDroppedElement.id,
            name: newDroppedElement.content,
          };
        } else {
          let students: ElementType[] = allStudents;
          if (team.mentor) {
            students = [...students, team.mentor];
          }
          setAllStudents(students.filter((s) => s.id !== newDroppedElement.id));

          updatedTeam.mentor = {
            id: newDroppedElement.id,
            name: newDroppedElement.content,
          };
        }

        return updatedTeam;
      })
    );
  };

  const deleteTeamSupportMember = (
    currentTeamId: number,
    deletedElement: {
      id: number;
      content: string;
      isTutor: boolean;
    }
  ) => {
    setSupportTeams((teams) =>
      teams.map((team) => {
        if (currentTeamId !== team.id) {
          return team;
        }

        const updatedTeam = { ...team };

        if (deletedElement.isTutor) {
          updatedTeam.tutor = null;
        } else {
          setAllStudents((students) => [
            ...students,
            { id: deletedElement.id, name: deletedElement.content },
          ]);

          updatedTeam.mentor = null;
        }

        return updatedTeam;
      })
    );
  };

  const onSubmit = async () => {
    const { data: responseData, error: responseError } =
      await updateSupportMembers({
        teams: supportTeams.map((team) => ({
          id: team.id,
          tutorId: team.tutor?.id || null,
          mentorId: team.mentor?.id || null,
        })),
        intensiveId: Number(intensiveId),
      });

    if (responseData) {
      setSaveModal(true);
    }

    if (responseError) {
      toast('Произошла серверная ошибка', { type: 'error' });
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {currentIntensive &&
            `Изменение команд сопровождения | ${currentIntensive.name}`}
        </title>
      </Helmet>

      <ToastContainer position="top-center" />

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
                    navigate(`/intensives/${intensiveId}/teams`);
                  }
                }}
                children="Отменить"
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
              navigate(`/intensives/${intensiveId}/teams`);
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
                    navigate(`/intensives/${intensiveId}/teams`);
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
      ) : supportTeams.length <= 0 ? (
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
              {supportTeams.map((team) => (
                <option key={team.id} value={team.id.toString()}>
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
                  onDelete={(deletedElement) => {
                    if (currentTeamId) {
                      deleteTeamSupportMember(currentTeamId, deletedElement);
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
                  onClick={onTutorSlugClick}
                  className={`transition-colors duration-300 cursor-pointer ${
                    slug === 'tutors' ? 'text-blue' : 'hover:text-blue'
                  }`}
                >
                  Тьюторы
                </button>
                <button
                  onClick={onMentorSlugClick}
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
                      ?.filter((teacher) =>
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
                      ?.filter((student) =>
                        student.name
                          .toLowerCase()
                          .includes(searchString.toLowerCase())
                      )
                      .map((student) => (
                        <SupportTeamDragElement
                          key={student.id}
                          data={{
                            id: student.id,
                            content: student.name,
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
