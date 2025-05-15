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
          {currentIntensive && `Команды | ${currentIntensive.name}`}
        </title>
      </Helmet>

      <Title text="Команды" />

      <div className="flex flex-col items-start justify-between xl:flex-row">
        <h2 className="text-lg font-bold mt-7">
          {isUserManager(currentUser)
            ? 'Созданные команды'
            : 'Существующие команды'}
        </h2>

        {isUserManager(currentUser) && (
          <div className="flex flex-col gap-3 mt-3 sm:flex-row xl:mt-0 xl:gap-5">
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
      </div>

      {isLoading ? (
        <Skeleton className="mt-5 md:mt-10" />
      ) : teams && teams.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3 mt-5 md:justify-start md:gap-6 md:mt-10">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team as ITeam} />
          ))}
        </div>
      ) : (
        <div className="mt-5 text-xl text-black md:mt-10">
          Команды еще не определены для этого интенсива
        </div>
      )}
    </>
  );
};

export default TeamsPage;
