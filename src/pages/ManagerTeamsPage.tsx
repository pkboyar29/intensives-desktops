import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useGetTeamsQuery } from '../redux/api/teamApi';

import Skeleton from 'react-loading-skeleton';
import Title from '../components/Title';
import PrimaryButton from '../components/PrimaryButton';
import TeamIcon from '../components/icons/TeamIcon';

const ManagerTeamsPage: FC = () => {
  const navigate = useNavigate();
  const { intensiveId } = useParams();

  const { data: teams, isLoading } = useGetTeamsQuery(Number(intensiveId), {
    refetchOnMountOrArgChange: true,
  });

  return (
    <div>
      <Title text="Команды" />

      {isLoading ? (
        <div className="w-1/2 mt-7">
          <Skeleton />
        </div>
      ) : (
        <>
          <h2 className="text-lg font-bold mt-7">Созданные команды</h2>

          {teams && teams.length > 0 ? (
            <div className="flex flex-wrap gap-6 mt-7">
              {teams.map((team) => (
                <div
                  className="flex-shrink flex-grow-0 basis-[16.67%]"
                  key={team.id}
                >
                  <div className="flex gap-2 transition duration-300 group">
                    <TeamIcon />
                    <h3 className="text-lg">{team.name}</h3>
                  </div>

                  <div className="flex flex-col gap-5 mt-3">
                    {team.studentsInTeam.length > 0 ? (
                      team.studentsInTeam.map((studentInTeam) => (
                        <span
                          key={studentInTeam.id}
                          className="px-4 py-[5.5px] text-center bg-gray_5 rounded-xl hover:bg-gray_6"
                        >
                          {studentInTeam.nameWithGroup}
                        </span>
                      ))
                    ) : (
                      <div className="text-bright_gray">Нет участников</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xl text-black mt-7">
              Команды еще не определены для этого интенсива
            </div>
          )}
        </>
      )}

      <div className="flex gap-5 mt-10">
        <div>
          <PrimaryButton
            text="Изменить состав команд"
            clickHandler={() => navigate(`/manager/${intensiveId}/createTeams`)}
          />
        </div>
        <div>
          <PrimaryButton
            text="Изменить команды сопровождения"
            clickHandler={() => console.log('yes')}
          />
        </div>
      </div>
    </div>
  );
};

export default ManagerTeamsPage;
