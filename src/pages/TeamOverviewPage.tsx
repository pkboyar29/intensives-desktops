import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAppSelector } from '../redux/store';

import Title from '../components/common/Title';
import OverviewContent from '../components/OverviewContent';
import { ITeam } from '../ts/interfaces/ITeam';

const TeamOverviewPage: FC = () => {
  const params = useParams();

  // TODO: отправлять запрос на получение текущей команды для студента. А если препод будет в эту страницу заходить?
  const currentTeam: ITeam = {
    id: null,
    index: 1,
    name: '',
    studentsInTeam: [],
    tutor: null,
    mentor: null,
    teamleadId: 1,  
  };

  const currentUser = useAppSelector((state) => state.user.data);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // TODO: заменить на skeleton
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
            {currentTeam.mentor?.nameWithGroup}
          </div>
        </div>
        <div>
          <h2 className="font-sans text-xl font-bold text-black">Тьютор</h2>
          <div className="mt-2 font-sans text-base text-bright_gray">
            {currentTeam.tutor?.name}
          </div>
        </div>
      </OverviewContent>
    </>
  );
};

export default TeamOverviewPage;
