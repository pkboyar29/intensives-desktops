import { FC } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

import { IEducationRequest } from '../ts/interfaces/IEducationRequest';

import Title from '../components/common/Title';
import Table from '../components/common/Table';

const EducationRequestsPage: FC = () => {
  const navigate = useNavigate();

  const columnHelper = createColumnHelper<IEducationRequest>();
  const columns = [
    columnHelper.accessor('id', {
      header: () => 'ID',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('subject', {
      header: () => 'Тема запроса',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('teamName', {
      header: () => 'Команда',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('createdDate', {
      header: () => 'Дата создания запроса',
      cell: (info) => info.getValue().toLocaleDateString(),
    }),
  ];

  return (
    <>
      <Title text="Образовательные запросы" />

      <Table
        onClick={(id: number) => navigate(`${id}`)}
        data={[]}
        columns={columns}
      />
    </>
  );
};

export default EducationRequestsPage;
