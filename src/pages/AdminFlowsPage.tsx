import { FC, useEffect, useState } from 'react';
import CrudTable from '../components/CrudTable';
import { useNavigate } from 'react-router-dom';
import { useLazyGetFlowsQuery } from '../redux/api/flowApi';
import { IFlow } from '../ts/interfaces/IFlow';

const AdminFlowsPage: FC = () => {
  const [getFlows, { data, isLoading, isError }] = useLazyGetFlowsQuery();

  const navigate = useNavigate();
  const [page, setPage] = useState(1); // Текущая страница
  const pageSize = 100; // Размер страницы

  useEffect(() => {
    getFlows({
      withChildrenMeta: true,
      page: page,
      pageSize: pageSize,
    });
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <p className="text-3xl font-medium">Потоки</p>
      {data && (
        <CrudTable<IFlow>
          data={data.results}
          type={'flows'}
          childEntities={data?.childEntitiesMeta}
          getId={(b) => b.id}
          onChildNavigatePath={(path) => {
            console.log(window.location.pathname);
            navigate(window.location.pathname + path);
          }}
        />
      )}
    </>
  );
};

export default AdminFlowsPage;
