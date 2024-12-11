import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';

import { createColumnHelper } from '@tanstack/react-table';

import Title from '../components/common/Title';
import Table from '../components/common/Table';
import { ITeam } from '../ts/interfaces/ITeam';

const TeamsPage: FC = () => {
  const params = useParams();

  const teams: ITeam[] = []
  const [isLoading, setIsLoading] = useState<boolean>(true);

  interface TeamForColumn {
    id: number,
    name: string,
    tutorNameSurname: string,
    mentorNameSurname: string
  }

  const columnHelper = createColumnHelper<TeamForColumn>();
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
      cell: (info) => 'Тьютор',
    }),
    columnHelper.accessor('mentorNameSurname', {
      header: () => 'Наставник',
      cell: (info) => 'Наставник',
    }),
  ];

  if (isLoading) {
    return <div className="mt-3 font-sans text-2xl font-bold">Загрузка...</div>;
  }

  return (
    <>
      <Title text="Команды на интенсиве" />

      <Table
        data={teams}
        columns={columns}
        onClick={(id: number) => console.log(`id команды вот такой: ${id}`)}
      />
    </>
  );
};

export default TeamsPage;
