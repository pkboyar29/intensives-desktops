import { useState, useEffect, FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLazyGetStudentsInFlowQuery } from '../redux/api/studentApi';
import { useCreateTeamsMutation } from '../redux/api/teamApi';
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

  // TODO: убрать currentIntensive и использовать intensiveId, когда не придется использоваться потоки из интенсива
  const currentIntensive = useAppSelector((state) => state.intensive.data);
  const [getStudentsInFlow] = useLazyGetStudentsInFlowQuery();
  const [createTeams] = useCreateTeamsMutation();

  const [freeStudents, setFreeStudents] = useState<IStudent[]>([]);

  const [teamsCount, setTeamsCount] = useState<number>(2);
  const [teams, setTeams] = useState<ITeamForManager[]>([]);

  const [searchString, setSearchString] = useState<string>('');
  const [searchResults, setSearchResults] = useState<IStudent[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (currentIntensive) {
        try {
          const { data: freeStudents } = await getStudentsInFlow(
            currentIntensive.flows[0].id
          );

          console.log('свободные студенты это');
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
    // TODO: вызывать GET запрос на получение существующих команд. Если их не существует, то отправляем POST запрос при создании команд?
    if (currentIntensive) {
      const initialTeamData: ITeamForManager[] = [
        { id: 1, name: 'Команда 1', studentsInTeam: [] },
        { id: 2, name: 'Команда 2', studentsInTeam: [] },
      ];

      setTeams(initialTeamData);
    }
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

  const [studentsInTeam, setStudentsInTeam] = useState<{
    [teamId: number]: IStudent[];
  }>([]);

  const updateStudentsInTeam = (teamId: number, students: IStudent[]) => {
    setStudentsInTeam((prevState) => ({
      ...prevState,
      [teamId]: students,
    }));
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
  // TODO: показывать модальное окно? При изменении количества групп, в которых уже есть участники, вы можете начать заполнение заново или сохранить уже добавленных участников в группах.
  // ДУМАЮ НАДО СРАЗУ ОЧИЩАТЬ. ЛИБО НАДО ОЧИЩАТЬ В СЛУЧАЕ, ЕСЛИ КОЛИЧЕСТВО КОМАНД БУДЕТ УМЕНЬШАТЬСЯ. ЛИБО НЕ ОТОБРАЖАТЬ МОДАЛЬНОЕ ОКНО?
  // ОТОБРАЖАТЬ МОДАЛЬНОЕ ОКНО С СООБЩЕНИЕМ О РИСКЕ ИСЧЕЗНОВЕНИЯ СОСТАВА КОМАНД, ЕСЛИ КОЛИЧЕСТВО КОМАНД БУДЕТ УМЕНЬШАТЬСЯ
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

  // TODO: как-то разделять тут создание и обновление команд. Ну у меня тут все сложнее будет...
  // как-то проверять, что вот, тут команд нету, выдает 0 ответов в запросе, значит, будем создавать
  const onSubmit = async () => {
    if (currentIntensive) {
      const teamsForRequest: ITeamCreate[] = teams.map((team) => ({
        name: team.name,
        studentIds: studentsInTeam[team.id]?.map((student) => student.id) || [],
      }));
      console.log(teamsForRequest);

      await createTeams({
        intensiveId: currentIntensive.id,
        teams: teamsForRequest,
      });

      navigate(`/manager/${currentIntensive.id}/teams`);
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
                updateStudentsInTeam(team.id, droppedElements);
              }}
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
