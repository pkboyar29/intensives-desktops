import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/store';
import { isUserManager } from '../helpers/userHelpers';
import { useGetTeamsQuery } from '../redux/api/teamApi';

import { Helmet } from 'react-helmet-async';
import Skeleton from 'react-loading-skeleton';
import Title from '../components/common/Title';
import PrimaryButton from '../components/common/PrimaryButton';
import TeamCard from '../components/TeamCard';

import { ITeam } from '../ts/interfaces/ITeam';

const TeamsPage: FC = () => {
  const currentUser = useAppSelector((state) => state.user.data);
  const currentIntensive = useAppSelector((state) => state.intensive.data);

  const navigate = useNavigate();
  const { intensiveId } = useParams();

  const { data: teams, isLoading } = useGetTeamsQuery(
    { intensiveId: Number(intensiveId), short: false },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  return (
    <>
      <Helmet>
        <title>
          {currentIntensive && `${currentIntensive.name} | Команды`}
        </title>
      </Helmet>

      <Title text="Команды" />

      <h2 className="text-lg font-bold mt-7">
        {isUserManager(currentUser)
          ? 'Созданные команды'
          : 'Существующие команды'}
      </h2>

      {isLoading ? (
        <Skeleton className="mt-7" />
      ) : teams && teams.length > 0 ? (
        <div className="flex flex-wrap gap-6 mt-7">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team as ITeam} />
          ))}
        </div>
      ) : (
        <div className="text-xl text-black mt-7">
          Команды еще не определены для этого интенсива
        </div>
      )}

      {isUserManager(currentUser) && (
        <div className="flex gap-5 mt-10">
          <div>
            <PrimaryButton
              children="Изменить состав команд"
              clickHandler={() =>
                navigate(`/intensives/${intensiveId}/createTeams`)
              }
            />
          </div>
          <div>
            <PrimaryButton
              children="Изменить команды сопровождения"
              clickHandler={() =>
                navigate(`/intensives/${intensiveId}/createSupportTeams`)
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TeamsPage;
