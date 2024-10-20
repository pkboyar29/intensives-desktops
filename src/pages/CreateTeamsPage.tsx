import { useState, useEffect, FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useLazyGetFreeStudentsQuery } from '../redux/api/studentApi';
import {
  useChangeAllTeamsMutation,
  useLazyGetTeamsQuery,
} from '../redux/api/teamApi';

import DragElement from '../components/DragComponents/DragElement';
import DragContainer from '../components/DragComponents/DragContainer';
import Title from '../components/Title';
import PrimaryButton from '../components/PrimaryButton';
import Modal from '../components/Modal';

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

  const [modal, setModal] = useState<boolean>(false);

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
              { id: null, index: 1, name: 'Команда 1', studentsInTeam: [] },
              { id: null, index: 2, name: 'Команда 2', studentsInTeam: [] },
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
    setModal(true);
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

        navigate(`/manager/${parseInt(intensiveId)}/teams`);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <>
      {modal && (
        <Modal
          title={'Изменение количества команд'}
          onCloseModal={() => setModal(false)}
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
                  setModal(false);
                }}
                text="Очистить команды"
              />
            </div>
            <div>
              <PrimaryButton
                clickHandler={() => {
                  changeTeamsCount(teamsCount);
                  setModal(false);
                }}
                text="Сохранить участников"
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
            text="Изменить"
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
            <DragContainer
              key={team.index}
              containerName={team.name}
              setAllElements={setFreeStudents}
              allElements={freeStudents}
              onDrop={(droppedElements: IStudent[]) => {
                // onDrop срабатывает, даже когда мы удаляем элементы из контейнера. он просто срабатывает всякий раз, когда droppedElements изменяется. мб переименовать?
                updateStudentsInTeam(team.index, droppedElements);
              }}
              parentDroppedElements={team.studentsInTeam}
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
                <DragElement key={freeStudent.id} data={freeStudent} />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
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
  );
};

export default CreateTeamsPage;
