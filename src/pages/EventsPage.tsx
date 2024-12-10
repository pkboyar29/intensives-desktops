import { FC, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';

import { useAppSelector } from '../redux/store';

import { EventsContext } from '../context/EventsContext';
import { IEvent } from '../ts/interfaces/IEvent';

import Title from '../components/common/Title';
import Table from '../components/common/Table';

const EventsPage: FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { events, setEventsForIntensiv, setEventsForTeam } =
    useContext(EventsContext);

  const currentUser = useAppSelector((state) => state.user.data);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (params.intensiveId && currentUser) {
        await setEventsForIntensiv(parseInt(params.intensiveId, 10));
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentUser, params.intensiveId]);

  useEffect(() => {
    const fetchData = async () => {
      if (params.teamId && currentUser) {
        setEventsForTeam(parseInt(params.teamId));
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentUser, params.teamId]);

  const columnHelper = createColumnHelper<IEvent>();
  const columns = [
    columnHelper.accessor('id', {
      header: () => 'ID',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: () => 'Наименование',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('startDate', {
      header: () => 'Начало мероприятия',
      cell: (info) => info.getValue().toLocaleString(),
    }),
    columnHelper.accessor('finishDate', {
      header: () => 'Конец мероприятия',
      cell: (info) => info.getValue().toLocaleString(),
    }),
  ];

  if (isLoading) {
    return <div className="mt-3 font-sans text-2xl font-bold">Загрузка...</div>;
  }

  return (
    <>
      <Title text="Все мероприятия" />

      <Table
        data={events}
        columns={columns}
        onClick={(id: number) => navigate(`${id}`)}
      />
    </>
  );
};

export default EventsPage;
