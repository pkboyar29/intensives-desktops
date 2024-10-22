import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useLazyGetTeamsQuery } from '../redux/api/teamApi';

import Title from '../components/Title';
import TeamIcon from '../components/icons/TeamIcon';

import { ITeamForManager } from '../ts/interfaces/ITeam';

const CreateSupportTeamsPage: FC = () => {
  const { intensiveId } = useParams();

  const [getTeams] = useLazyGetTeamsQuery();

  const [teams, setTeams] = useState<ITeamForManager[]>([]);
  const [currentTeam, setCurrentTeam] = useState<ITeamForManager>();

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

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);

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

      <div className="flex gap-10 mt-8">
        <div>
          {currentTeam && (
            <>
              <div className="text-lg font-bold text-black">
                {currentTeam.name}
              </div>

              <p className="text-base text-bright_gray mt-2.5">
                Для добавления наставника и тьютора в команду выберите их из
                списка справа
              </p>

              <div className="mt-2.5 flex gap-4">
                <TeamIcon />
                <div className="flex flex-col gap-1.5">
                  <div className="text-lg text-black">{currentTeam.name}</div>
                  <div className="text-bright_gray">Нет тьютора</div>
                  <div className="text-bright_gray">Нет наставника</div>
                  {currentTeam.studentsInTeam.length > 0 ? (
                    <div className="flex flex-col gap-1.5">
                      {currentTeam.studentsInTeam.map((studentInTeam) => (
                        <div className="flex items-center gap-3 px-3 py-1 text-base rounded-xl bg-gray_5 hover:bg-gray_6">
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

        <div></div>
      </div>
    </>
  );
};

export default CreateSupportTeamsPage;
