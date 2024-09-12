import { FC, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { TeamsContext } from '../context/TeamsContext';
import { CurrentUserContext } from '../context/CurrentUserContext';

import Title from '../components/Title';
import OverviewContent from '../components/OverviewContent';

const TeamOverviewPage: FC = () => {
  const params = useParams();
  const { currentTeam, setCurrentTeamForStudent } = useContext(TeamsContext);
  const { currentUser } = useContext(CurrentUserContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (params.teamId && currentUser) {
        await setCurrentTeamForStudent(parseInt(params.teamId, 10));
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  if (isLoading) {
    return <div className="mt-3 font-sans text-2xl font-bold">Загрузка...</div>;
  }

  return (
    <>
      <Title text={currentTeam.name} />

      <OverviewContent>
        <div>
          <h2 className="font-sans text-xl font-bold text-black">Наставник</h2>
          <div className="mt-2 font-sans text-base text-bright_gray">
            {currentTeam.mentorNameSurname}
          </div>
        </div>
        <div>
          <h2 className="font-sans text-xl font-bold text-black">Тьютор</h2>
          <div className="mt-2 font-sans text-base text-bright_gray">
            {currentTeam.tutorNameSurname}
          </div>
        </div>
      </OverviewContent>
    </>
  );
};

export default TeamOverviewPage;
