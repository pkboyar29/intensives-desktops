import { FC, useEffect, useState } from 'react';
import { useLazyGetUniversitiesQuery } from '../redux/api/universityApi';
import CrudTable from '../components/CrudTable';
import { IUniversity } from '../ts/interfaces/IUniversity';
import { universityColumns } from '../tableConfigs/nameConfig';
import { useNavigate } from 'react-router-dom';

const AdminUniversitiesPage: FC = () => {
  const [getUniversities, { data, isLoading, isError }] =
    useLazyGetUniversitiesQuery();

  const navigate = useNavigate();
  const [page, setPage] = useState(1); // Текущая страница
  const pageSize = 100; // Размер страницы

  useEffect(() => {
    getUniversities({ withChildrenMeta: true, page: page, pageSize: pageSize });
  }, []);

  useEffect(() => {
    //console.log(data);
  }, [data]);

  return (
    <>
      <p className="text-3xl font-medium">Университеты</p>
      {data && (
        <CrudTable<IUniversity>
          data={data.results}
          //columns={universityColumns}
          type={'universities'}
          childEntities={data?.childEntitiesMeta}
          onChildNavigatePath={(path) => {
            console.log(window.location.pathname);
            navigate(window.location.pathname + path);
          }}
        />
      )}
    </>
  );
};

export default AdminUniversitiesPage;
