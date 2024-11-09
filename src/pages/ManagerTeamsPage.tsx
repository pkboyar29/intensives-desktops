import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useGetTeamsQuery } from '../redux/api/teamApi';

import Skeleton from 'react-loading-skeleton';
import Tag from '../components/Tag';
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
                  className="flex-shrink flex-grow-0 basis-[16.67%] flex flex-col gap-3"
                  key={team.id}
                >
                  <div className="flex gap-2 transition duration-300 group">
                    <TeamIcon />
                    <h3 className="text-lg">{team.name}</h3>
                  </div>

                  {team.tutor && (
                    <div className="flex gap-3 h-9">
                      <div className="flex items-center justify-center p-3 text-base font-bold leading-none rounded-lg w-9 bg-gray_5">
                        Т
                      </div>
                      <Tag
                        content={team.tutor.name}
                        shouldHaveCrossIcon={false}
                      />
                    </div>
                  )}

                  {team.mentor && (
                    <div className="flex gap-3 h-9">
                      <div className="flex items-center justify-center p-3 text-base font-bold leading-none rounded-lg w-9 bg-gray_5">
                        Н
                      </div>
                      <Tag
                        content={team.mentor.nameWithGroup}
                        shouldHaveCrossIcon={false}
                      />
                    </div>
                  )}

                  {!team.tutor && (
                    <div className="text-bright_gray">Нет тьютора</div>
                  )}
                  {!team.mentor && (
                    <div className="text-bright_gray">Нет наставника</div>
                  )}

                  <div className="flex flex-col gap-3">
                    {team.studentsInTeam.length > 0 ? (
                      team.studentsInTeam.map((studentInTeam) => (
                        <Tag
                          key={studentInTeam.id}
                          content={studentInTeam.nameWithGroup}
                          shouldHaveCrossIcon={false}
                        />
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
            children="Изменить состав команд"
            clickHandler={() => navigate(`/manager/${intensiveId}/createTeams`)}
          />
        </div>
        <div>
          <PrimaryButton
            children="Изменить команды сопровождения"
            clickHandler={() =>
              navigate(`/manager/${intensiveId}/createSupportTeams`)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ManagerTeamsPage;
