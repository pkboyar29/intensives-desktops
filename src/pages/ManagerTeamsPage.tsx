import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useGetTeamsQuery } from '../redux/api/teamApi';

import { useAppSelector } from '../redux/store';

import Skeleton from 'react-loading-skeleton';
import Title from '../components/common/Title';
import PrimaryButton from '../components/common/PrimaryButton';
import TeamCard from '../components/TeamCard';

const ManagerTeamsPage: FC = () => {
  const currentUser = useAppSelector((state) => state.user.data);

  const navigate = useNavigate();
  const { intensiveId } = useParams();

  const { data: teams, isLoading } = useGetTeamsQuery(Number(intensiveId), {
    refetchOnMountOrArgChange: true,
  });

  return (
    <div>
      <Title text="Команды" />

      <h2 className="text-lg font-bold mt-7">
        {currentUser?.roleNames.includes('Организатор')
          ? 'Созданные команды'
          : 'Существующие команды'}
      </h2>

      {isLoading ? (
        <Skeleton className="mt-7" />
      ) : teams && teams.length > 0 ? (
        <div className="flex flex-wrap gap-6 mt-7">
          {teams.map((team) => (
            <TeamCard key={team.index} team={team} />
          ))}
        </div>
      ) : (
        <div className="text-xl text-black mt-7">
          Команды еще не определены для этого интенсива
        </div>
      )}

      {currentUser?.roleNames.includes('Организатор') && (
        <div className="flex gap-5 mt-10">
          <div>
            <PrimaryButton
              children="Изменить состав команд"
              clickHandler={() =>
                navigate(`/manager/${intensiveId}/createTeams`)
              }
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
      )}
    </div>
  );
};

export default ManagerTeamsPage;
