import { useState, useEffect, FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useLazyGetFreeStudentsQuery } from '../redux/api/studentApi';
import {
  useChangeAllTeamsMutation,
  useLazyGetTeamsQuery,
} from '../redux/api/teamApi';

import TeamDragElement from '../components/DragComponents/TeamDragElement';
import TeamDragContainer from '../components/DragComponents/TeamDragContainer';
import Title from '../components/Title';
import PrimaryButton from '../components/PrimaryButton';
import Modal from '../components/modals/Modal';

import SearchIcon from '../components/icons/SearchIcon';
import MembersIcon from '../components/icons/MembersIcon';

import { IStudent } from '../ts/interfaces/IStudent';
import { ITeamCreate, ITeamForManager } from '../ts/interfaces/ITeam';

const CreateTeamsPage: FC = () => {
  const navigate = useNavigate();

  const { intensiveId } = useParams();
  const [getFreeStudents] = useLazyGetFreeStudentsQuery();
  const [getTeams] = useLazyGetTeamsQuery();
  const [changeAllTeams] = useChangeAllTeamsMutation();

  const [freeStudents, setFreeStudents] = useState<IStudent[]>([]);

  const [teamsCount, setTeamsCount] = useState<number>(0);
  const [teams, setTeams] = useState<ITeamForManager[]>([]);

  const [searchString, setSearchString] = useState<string>('');
  const [searchResults, setSearchResults] = useState<IStudent[]>([]);

  const [teamsCountModal, setTeamsCountModal] = useState<boolean>(false);
  const [cancelModal, setCancelModal] = useState<boolean>(false);
  const [saveModal, setSaveModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchStudents = async () => {
      if (intensiveId) {
        try {
          const { data: freeStudents } = await getFreeStudents(
            parseInt(intensiveId)
          );

          if (freeStudents) {
            setFreeStudents(freeStudents);
            setSearchResults(freeStudents);
          }
        } catch (e) {
          console.log(e);
        }
      }
    };

    fetchStudents();
  }, [intensiveId]);

  useEffect(() => {
    const fetchTeams = async () => {
      if (intensiveId) {
        try {
          const { data: teamsResponse } = await getTeams(parseInt(intensiveId));

          if (teamsResponse && teamsResponse.length > 0) {
            setTeamsCount(teamsResponse.length);
            setTeams(teamsResponse);
          } else {
            const initialTeamData: ITeamForManager[] = [
              {
                id: null,
                index: 1,
                name: 'Команда 1',
                studentsInTeam: [],
                tutor: null,
                mentor: null,
              },
              {
                id: null,
                index: 2,
                name: 'Команда 2',
                studentsInTeam: [],
                tutor: null,
                mentor: null,
              },
            ];

            setTeamsCount(2);
            setTeams(initialTeamData);
          }
        } catch (e) {
          console.log(e);
        }
      }
    };

    fetchTeams();
  }, [intensiveId]);

  useEffect(() => {
    if (searchString)
      setSearchResults(
        freeStudents.filter((item) =>
          item.nameWithGroup.toLowerCase().includes(searchString.toLowerCase())
        )
      );
    else {
      setSearchResults(freeStudents);
    }
  }, [searchString, freeStudents]);

  const updateStudentsInTeam = (teamIndex: number, students: IStudent[]) => {
    setTeams((prevTeams) =>
      prevTeams.map((prevTeam) => {
        if (prevTeam.index === teamIndex) {
          return {
            ...prevTeam,
            studentsInTeam: students,
          };
        } else {
          return prevTeam;
        }
      })
    );
  };

  const searchInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  const teamsCountInputChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTeamsCount(parseInt(e.target.value));
  };

  const teamsCountButtonClickHandler = () => {
    setTeamsCountModal(true);
  };

  const clearTeams = () => {
    const allStudentsInTeams: IStudent[] = teams.flatMap(
      (team) => team.studentsInTeam
    );

    setTeams((prevTeams) =>
      prevTeams.map((team) => ({ ...team, studentsInTeam: [] }))
    );

    setFreeStudents((prevFreeStudents) => [
      ...prevFreeStudents,
      ...allStudentsInTeams,
    ]);
  };

  const changeTeamsCount = (teamsCount: number) => {
    const prevTeamsCount = teams.length;

    if (teamsCount !== 0) {
      if (prevTeamsCount < teamsCount) {
        // teams count will increase

        const newTeams: ITeamForManager[] = [];
        for (let i = prevTeamsCount + 1; i <= teamsCount; i++) {
          newTeams.push({
            id: null,
            index: i,
            name: `Команда ${i}`,
            studentsInTeam: [],
            tutor: null,
            mentor: null,
          });
        }
        setTeams((prevState) => [...prevState, ...newTeams]);
      } else if (prevTeamsCount > teamsCount) {
        // teams count will reduce

        setTeams((prevTeams) => {
          const reducedStudentsInTeam: IStudent[] = [];
          const remainingTeams: ITeamForManager[] = [];

          for (let i = 0; i < prevTeamsCount; i++) {
            if (i <= teamsCount - 1) {
              remainingTeams.push(prevTeams[i]);
            } else {
              reducedStudentsInTeam.push(...prevTeams[i].studentsInTeam);
            }
          }

          setFreeStudents((prevFreeStudents) => [
            ...prevFreeStudents,
            ...reducedStudentsInTeam,
          ]);

          return remainingTeams;
        });
      }
    }
  };

  const handleStudentMove = (
    team: ITeamForManager,
    droppedStudent: IStudent
  ) => {
    const sourceTeam: ITeamForManager | undefined = teams.find((team) =>
      team.studentsInTeam.some((student) => student.id === droppedStudent.id)
    );
    if (sourceTeam) {
      const reducedStudentsInTeam: IStudent[] =
        sourceTeam.studentsInTeam.filter(
          (student) => student.id !== droppedStudent.id
        );

      updateStudentsInTeam(sourceTeam.index, reducedStudentsInTeam);
    } else {
      setFreeStudents(
        freeStudents.filter(
          (freeStudent) => freeStudent.id !== droppedStudent.id
        )
      );
    }

    const newStudentsInTeam: IStudent[] = [
      ...team.studentsInTeam,
      droppedStudent,
    ];
    updateStudentsInTeam(team.index, newStudentsInTeam);
  };

  const handleStudentDelete = (
    team: ITeamForManager,
    studentToDelete: IStudent
  ) => {
    const reducedStudentsInTeam: IStudent[] = team.studentsInTeam.filter(
      (student) => student.id !== studentToDelete.id
    );
    updateStudentsInTeam(team.index, reducedStudentsInTeam);

    setFreeStudents([...freeStudents, studentToDelete]);
  };

  const onSubmit = async () => {
    if (intensiveId) {
      const teamsForRequest: ITeamCreate[] = teams.map((team) => ({
        id: team.id,
        name: team.name,
        studentIds: team.studentsInTeam.map(
          (studentInTeam) => studentInTeam.id
        ),
      }));

      try {
        await changeAllTeams({
          intensiveId: parseInt(intensiveId),
          teams: teamsForRequest,
        });

        setSaveModal(true);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <>
      {teamsCountModal && (
        <Modal
          title={'Изменение количества команд'}
          onCloseModal={() => setTeamsCountModal(false)}
        >
          <p className="text-lg text-bright_gray">
            При изменении количества команд, в которых уже есть участники, вы
            можете начать заполнение заново или сохранить уже добавленных
            участников в командах
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <div>
              <PrimaryButton
                buttonColor="gray"
                clickHandler={() => {
                  clearTeams();
                  changeTeamsCount(teamsCount);
                  setTeamsCountModal(false);
                }}
                children="Очистить команды"
              />
            </div>
            <div>
              <PrimaryButton
                clickHandler={() => {
                  changeTeamsCount(teamsCount);
                  setTeamsCountModal(false);
                }}
                children="Сохранить участников"
              />
            </div>
          </div>
        </Modal>
      )}

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
          title="Команды успешно изменены"
          onCloseModal={() => {
            setSaveModal(false);
            if (intensiveId) {
              navigate(`/manager/${intensiveId}/teams`);
            }
          }}
        >
          <p className="text-lg text-bright_gray">
            Состав команд успешно изменен
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

      <Title text="Команды" />

      <p className="mt-3 text-base text-gray_3">
        Создайте команды и распределите участников интенсива по командам
      </p>

      <div className="flex items-center gap-4 mt-5">
        <div className="relative w-[480px]">
          <input
            type="number"
            placeholder="Количество команд"
            onChange={teamsCountInputChangeHandler}
            className="w-full p-2 border rounded-md border-gray_4"
            value={teamsCount}
          />
          <MembersIcon />
        </div>

        <div>
          <PrimaryButton
            children="Изменить"
            clickHandler={() => teamsCountButtonClickHandler()}
          />
        </div>
      </div>

      <div className="flex gap-10 mt-5">
        <div className="flex flex-col gap-3 basis-1/3">
          <h2 className="text-lg font-bold text-black_2">Созданные команды</h2>
          <p className="text-base text-bright_gray">
            Для добавления участников в команды вы можете использовать
            выпадающий список или переместить свободных участников в команды с
            помощью drag and drop
          </p>
          {teams.map((team) => (
            <TeamDragContainer
              key={team.index}
              containerName={team.name}
              onDrop={(droppedElement) => {
                handleStudentMove(team, {
                  id: droppedElement.id,
                  nameWithGroup: droppedElement.content,
                });
              }}
              onDelete={(deletedElement) => {
                handleStudentDelete(team, {
                  id: deletedElement.id,
                  nameWithGroup: deletedElement.content,
                });
              }}
              droppedElements={team.studentsInTeam.map((studentInTeam) => ({
                id: studentInTeam.id,
                content: studentInTeam.nameWithGroup,
              }))}
            />
          ))}
        </div>

        <div className="sticky flex flex-col gap-3 h-fit top-5 basis-2/3">
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-black_2">
              Свободные участники
            </h2>

            <div className="relative flex items-center mx-4">
              <SearchIcon />
              <input
                type="text"
                placeholder="Поиск"
                className="w-full py-3 pl-12 pr-2 rounded-xl bg-another_white"
                value={searchString}
                onChange={searchInputChangeHandler}
              />
            </div>

            <div className="rounded-[10px] border border-dashed border-bright_gray py-3 px-6 flex flex-wrap gap-2 justify-center">
              {searchResults.map((freeStudent) => (
                <TeamDragElement
                  key={freeStudent.id}
                  data={{
                    id: freeStudent.id,
                    content: freeStudent.nameWithGroup,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
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
  );
};

export default CreateTeamsPage;
