import { FC, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TeamsContext } from '../context/TeamsContext';
import { createColumnHelper } from '@tanstack/react-table';

import { ITeam } from '../ts/interfaces/ITeam';

import Title from '../components/Title';
import Table from '../components/Table';

const TeamsPage: FC = () => {
  const params = useParams();
  const { teams, getTeams } = useContext(TeamsContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (params.intensiveId) {
        getTeams(parseInt(params.intensiveId, 10));
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const columnHelper = createColumnHelper<ITeam>();
  const columns = [
    columnHelper.accessor('id', {
      header: () => 'ID',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: () => 'Название команды',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('tutorNameSurname', {
      header: () => 'Тьютор',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('mentorNameSurname', {
      header: () => 'Наставник',
      cell: (info) => info.getValue(),
    }),
  ];

  if (isLoading) {
    return <div className="mt-3 font-sans text-2xl font-bold">Загрузка...</div>;
  }

  return (
    <>
      <Title text="Команды в интенсиве" />

      <Table
        data={teams}
        columns={columns}
        onClick={(id: number) => console.log(`id команды вот такой: ${id}`)}
      />
    </>
  );
};

export default TeamsPage;
