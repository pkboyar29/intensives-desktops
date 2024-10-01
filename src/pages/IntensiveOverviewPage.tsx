import { FC } from 'react';
import { useAppSelector } from '../redux/store';

import Title from '../components/Title';
import OverviewContent from '../components/OverviewContent';
import OverviewItem from '../components/OverviewItem';

import Skeleton from 'react-loading-skeleton';

const IntensiveOverviewPage: FC = () => {
  // TODO: here also take isLoading so also store isLoading in redux store: state.intensive
  // below when i am trying to display skeleton if there are no currentIntensive, is absolutely wrong
  const currentIntensive = useAppSelector((state) => state.intensive.data);

  return (
    <>
      {currentIntensive ? (
        <>
          <Title text={currentIntensive.name} />

          <div className="mt-5 text-lg font-bold">
            {currentIntensive.open_dt.toLocaleDateString() +
              ' - ' +
              currentIntensive.close_dt.toLocaleDateString()}
          </div>

          <div className="mt-5">
            <OverviewContent>
              <OverviewItem
                title="Описание"
                value={currentIntensive.description}
              />
              <OverviewItem
                title="Начало интенсива"
                value={currentIntensive.open_dt.toLocaleDateString()}
              />
              <OverviewItem
                title="Окончание интенсива"
                value={currentIntensive.close_dt.toLocaleDateString()}
              />
              <OverviewItem
                title="Учебный поток"
                value={currentIntensive?.flows[0].name}
              />
            </OverviewContent>
          </div>
        </>
      ) : (
        <Skeleton />
      )}
    </>
  );
};

export default IntensiveOverviewPage;
