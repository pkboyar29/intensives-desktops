import { FC } from 'react';
import { useParams } from 'react-router-dom';

import Title from '../components/Title';

const EducationRequestOverviewPage: FC = () => {
  const params = useParams();

  return (
    <>
      <Title text="Просмотр образовательного запроса" />

      <div className="overview__container">
        <div className="overview__item">
          <h2 className="mini-title">Тема запроса</h2>
        </div>
        <div className="overview__item">
          <h2 className="mini-title">Описание запроса</h2>
        </div>
        <div className="overview__item">
          <h2 className="mini-title">Команда</h2>
        </div>
        <div className="overview__item">
          <h2 className="mini-title">Владелец запроса</h2>
        </div>
        <div className="overview__item">
          <h2 className="mini-title">Дата создания запроса</h2>
        </div>
      </div>
    </>
  );
};

export default EducationRequestOverviewPage;
