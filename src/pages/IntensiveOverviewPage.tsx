import { FC, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Intensive } from '../utils/types/Intensive';
import { IntensivesContext } from '../context/IntensivesContext';
import { TeamsContext } from '../context/TeamsContext';

import Title from '../components/Title';
import OverviewContent from '../components/OverviewContent';
import OverviewItem from '../components/OverviewItem';

const IntensiveOverviewPage: FC = () => {
  const params = useParams();
  const [currentIntensive, setCurrentIntensive] = useState<
    Intensive | undefined
  >(undefined);
  const { getIntensiveById } = useContext(IntensivesContext);
  const { currentTeam } = useContext(TeamsContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDataForTeacher = async () => {
      if (params.intensiveId) {
        const currentIntensive: Intensive = await getIntensiveById(
          parseInt(params.intensiveId, 10)
        );
        setCurrentIntensive(currentIntensive);
        setIsLoading(false);
      }
    };
    fetchDataForTeacher();
  }, [params.intensiveId]);

  useEffect(() => {
    const fetchDataForStudent = async () => {
      if (params.teamId) {
        const currentIntensive: Intensive = await getIntensiveById(
          currentTeam.intensiveId
        );
        setCurrentIntensive(currentIntensive);
        setIsLoading(false);
      }
    };
    fetchDataForStudent();
  }, [params.teamId]);

  if (isLoading) {
    return <div className="mt-3 font-sans text-2xl font-bold">Загрузка...</div>;
  }

  return (
    <>
      {currentIntensive && <Title text={currentIntensive.name} />}

      <div className="mt-5 text-lg font-bold">
        {currentIntensive?.open_dt.toLocaleDateString() +
          ' - ' +
          currentIntensive?.close_dt.toLocaleDateString()}
      </div>

      <div className="mt-5">
        <OverviewContent>
          <OverviewItem
            title="Описание"
            value={currentIntensive?.description}
          />
          <OverviewItem
            title="Начало интенсива"
            value={currentIntensive?.open_dt.toLocaleDateString()}
          />
          <OverviewItem
            title="Окончание интенсива"
            value={currentIntensive?.close_dt.toLocaleDateString()}
          />
          <OverviewItem title="Учебный поток" value={currentIntensive?.flow} />
        </OverviewContent>
      </div>
    </>
  );
};

export default IntensiveOverviewPage;
