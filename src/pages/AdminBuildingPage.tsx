import { FC, useEffect, useState } from 'react';
import { useLazyGetUniversitiesQuery } from '../redux/api/universityApi';
import CrudTable from '../components/CrudTable';
import { IUniversity } from '../ts/interfaces/IUniversity';
import { buildingColumns } from '../tableConfigs/nameConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { useLazyGetBuildingsQuery } from '../redux/api/buildingApi';
import { IBuilding } from '../ts/interfaces/IBuilding';

const AdminBuildingsPage: FC = () => {
  const [getBuildings, { data, isLoading, isError }] =
    useLazyGetBuildingsQuery();

  const { universityId } = useParams();

  const navigate = useNavigate();
  const [page, setPage] = useState(1); // Текущая страница
  const pageSize = 100; // Размер страницы

  useEffect(() => {
    getBuildings({
      universities: universityId ? parseInt(universityId) : null,
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
      <p className="text-3xl font-medium">Корпуса</p>
      {data && (
        <CrudTable<IBuilding>
          data={data.results}
          type={'buildings'}
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

export default AdminBuildingsPage;
