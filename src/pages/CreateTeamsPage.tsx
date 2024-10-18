import { useState, useEffect, FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLazyGetFreeStudentsQuery } from '../redux/api/studentApi';
import {
  useCreateTeamsMutation,
  useLazyGetTeamsQuery,
} from '../redux/api/teamApi';
import { useAppSelector } from '../redux/store';

import DragElement from '../components/DragComponents/DragElement';
import DragContainer from '../components/DragComponents/DragContainer';
import Title from '../components/Title';
import PrimaryButton from '../components/PrimaryButton';

import SearchIcon from '../components/icons/SearchIcon';
import MembersIcon from '../components/icons/MembersIcon';

import { IStudent } from '../ts/interfaces/IStudent';
import { ITeam, ITeamCreate, ITeamForManager } from '../ts/interfaces/ITeam';

const CreateTeamsPage: FC = () => {
  const navigate = useNavigate();

  // TODO: убрать currentIntensive и использовать intensiveId, когда не придется использоваться потоки из интенсива, то есть когда начну получать свободных студентов
  const currentIntensive = useAppSelector((state) => state.intensive.data);
  const [getFreeStudents] = useLazyGetFreeStudentsQuery();
  const [getTeams] = useLazyGetTeamsQuery();

  const [createTeams] = useCreateTeamsMutation();

  const [freeStudents, setFreeStudents] = useState<IStudent[]>([]);

  const [teamsCount, setTeamsCount] = useState<number>(0);
  const [teams, setTeams] = useState<ITeamForManager[]>([]);

  const [searchString, setSearchString] = useState<string>('');
  const [searchResults, setSearchResults] = useState<IStudent[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (currentIntensive) {
        try {
          const { data: freeStudents } = await getFreeStudents(
            currentIntensive.id
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
  }, [currentIntensive]);

  useEffect(() => {
    const fetchTeams = async () => {
      if (currentIntensive) {
        try {
          const { data: teamsResponse } = await getTeams(currentIntensive.id);

          if (teamsResponse && teamsResponse.length > 0) {
            setTeamsCount(teamsResponse.length);
            setTeams(teamsResponse);

            // TODO: как-то сделать так, чтобы сами студенты тоже устанавливались как-то, для этого надо изменить DragContainer, передавать туда что-то пропсом
          } else {
            const initialTeamData: ITeamForManager[] = [
              { id: 1, name: 'Команда 1', studentsInTeam: [] },
              { id: 2, name: 'Команда 2', studentsInTeam: [] },
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
  }, [currentIntensive]);

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

  const updateStudentsInTeam = (teamId: number, students: IStudent[]) => {
    setTeams((prevTeams) =>
      prevTeams.map((prevTeam) => {
        if (prevTeam.id === teamId) {
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

  // TODO: логично все команды интенсива для организаторов хранить в глобальном состоянии? потому что в трех страницах будет юзаться
  // TODO: показывать модальное окно?
  const teamsCountButtonClickHandler = (teamsCount: number) => {
    const prevTeamsCount = teams.length;
    if (prevTeamsCount < teamsCount) {
      // teams count will increase

      const newTeams: ITeamForManager[] = [];
      for (let i = prevTeamsCount + 1; i <= teamsCount; i++) {
        newTeams.push({ id: i, name: `Команда ${i}`, studentsInTeam: [] });
      }
      setTeams((prevState) => [...prevState, ...newTeams]);
    } else if (prevTeamsCount > teamsCount) {
      // teams count will reduce

      setTeams((prevState) => prevState.slice(0, teamsCount));
    }
  };

  const onSubmit = async () => {
    if (currentIntensive) {
      const teamsForRequest: ITeamCreate[] = teams.map((team) => ({
        name: team.name,
        studentIds: team.studentsInTeam.map(
          (studentInTeam) => studentInTeam.id
        ),
      }));

      try {
        await createTeams({
          intensiveId: currentIntensive.id,
          teams: teamsForRequest,
        });

        navigate(`/manager/${currentIntensive.id}/teams`);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div>
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
            clickHandler={() => teamsCountButtonClickHandler(teamsCount)}
          />
        </div>
      </div>

      <div className="flex gap-10 mt-5">
        <div className="max-w-[470px] flex flex-col gap-3">
          <h2 className="text-lg font-bold text-black_2">Созданные команды</h2>
          <p className="text-base text-bright_gray">
            Для добавления участников в команды вы можете использовать
            выпадающий список или переместить свободных участников в команды с
            помощью drag and drop
          </p>
          {teams.map((team) => (
            <DragContainer
              key={team.id}
              containerName={team.name}
              setAllElements={setFreeStudents}
              allElements={freeStudents}
              onDrop={(droppedElements: IStudent[]) => {
                // onDrop срабатывает, даже когда мы удаляем элементы из контейнера. он просто срабатывает всякий раз, когда droppedElements изменяется. мб переименовать?
                updateStudentsInTeam(team.id, droppedElements);
              }}
              initialDroppedElements={team.studentsInTeam}
            />
          ))}
        </div>

        <div className="max-w-[470px] flex flex-col gap-3">
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

            {/* justify-center */}
            <div className="rounded-[10px] border border-dashed border-bright_gray py-3 px-6 flex flex-wrap gap-2">
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
                  if (currentIntensive) {
                    navigate(`/manager/${currentIntensive.id}/teams`);
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
    </div>
  );
};

export default CreateTeamsPage;
