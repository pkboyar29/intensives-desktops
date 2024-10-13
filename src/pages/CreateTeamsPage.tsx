import { useState, useEffect, FC } from 'react';

import { useLazyGetStudentsInFlowQuery } from '../redux/api/studentApi';
import { useAppSelector } from '../redux/store';

import DragElement from '../components/DragComponents/DragElement';
import DragContainer from '../components/DragComponents/DragContainer';
import Title from '../components/Title';
import PrimaryButton from '../components/PrimaryButton';

import SearchIcon from '../components/icons/SearchIcon';
import MembersIcon from '../components/icons/MembersIcon';

import { IStudent } from '../ts/interfaces/IStudent';
import { ITeam } from '../ts/interfaces/ITeam';

const CreateTeamsPage: FC = () => {
  const currentIntensive = useAppSelector((state) => state.intensive.data);

  const [getStudentsInFlow] = useLazyGetStudentsInFlowQuery();

  useEffect(() => {
    const fetchStudents = async () => {
      if (currentIntensive) {
        // TODO: что-то изменить в случае, если потоков несколько. Если будет просто эндпоинт на получение свободных студентов. То это прям в бекенде будет получаться, если там несколько потоков будет
        try {
          const { data: freeStudents } = await getStudentsInFlow(
            currentIntensive.flows[0].id
          );

          console.log('студенты это');
          console.log(freeStudents);

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
    if (currentIntensive) {
      // const teamData: ITeam[] = [
      //   { id: 1, name: 'Команда 1', intensiveId: currentIntensive.id },
      //   { id: 2, name: 'Команда 2', intensiveId: currentIntensive.id },
      // ];

      const teamData: any[] = [
        { id: 1, name: 'Команда 1' },
        { id: 2, name: 'Команда 2' },
      ];

      setTeams(teamData);
    }
  }, [currentIntensive]);

  const [freeStudents, setFreeStudents] = useState<IStudent[]>([]);

  const [teamsCount, setTeamsCount] = useState<number>(2);
  const [teams, setTeams] = useState<any[]>([]);

  const [searchString, setSearchString] = useState<string>('');
  const [searchResults, setSearchResults] = useState<IStudent[]>([]);

  const searchInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

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

  const teamsCountInputChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTeamsCount(parseInt(e.target.value));
  };

  // TODO: ДЛЯ КОМАНД НАЧАТЬ ИСПОЛЬЗОВАТЬ ИНТЕРФЕЙС ITEAM?, туда надо интенсив привязывать
  // TODO: логично список команд для организаторов хранить в глобальном состоянии? потому что в трех страницах будет юзаться
  const teamsCountButtonClickHandler = () => {
    let newTeams = [];
    for (let i = 1; i <= teamsCount; i++) {
      newTeams.push({ id: `Команда` + i, name: `Команда ${i}` });
    }
    console.log('hello');
    setTeams(newTeams);
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
            clickHandler={teamsCountButtonClickHandler}
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
            />
          ))}
        </div>

        <div className="max-w-[470px] flex flex-col gap-3">
          <div className="flex flex-col flex-grow gap-3">
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

          <div className="flex justify-end">
            <div>
              <PrimaryButton
                text="Сохранить"
                clickHandler={() => console.log('сохранить?')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamsPage;
