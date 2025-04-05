import { FC, useEffect, useState } from 'react';
import CrudTable from '../components/CrudTable';
import { useNavigate, useParams } from 'react-router-dom';
import { useLazyGetFlowsQuery } from '../redux/api/flowApi';
import { IFlow } from '../ts/interfaces/IFlow';
import {
  entitiesConfig,
  useEntityQueryHook,
} from '../tableConfigs/entitiesConfig';

interface AdminEntityPageProps {
  entityType: string;
}

const AdminEntityPage: FC<AdminEntityPageProps> = ({ entityType }) => {
  const navigate = useNavigate();
  const urlParams = useParams();

  const config = entitiesConfig[entityType as keyof typeof entitiesConfig];
  if (!config) return <div>Unknown entity</div>;

  const [fetchData, { data, isLoading, isError }] =
    useEntityQueryHook(entityType);

  const [page, setPage] = useState(1); // Текущая страница
  const pageSize = 100; // Размер страницы

  const [extraParams, setExtraParams] = useState({
    page: page,
    pageSize: pageSize,
  });

  const paramsFromUrl: Record<string, string> = {};
  for (const dep of config.queryParamsDependencies ?? []) {
    const value = urlParams[dep.from];
    if (value) {
      paramsFromUrl[dep.as] = value;
      console.log(dep.from, value);
    }
  }

  const paramsFromConfig = config.defaultQueryParams ?? {};

  useEffect(() => {
    if (fetchData) {
      fetchData({ ...paramsFromUrl, ...paramsFromConfig, ...extraParams });
      //console.log('fetch');
    }
  }, [fetchData]);

  useEffect(() => {
    //console.log(data);
  }, [data]);

  return (
    <>
      <p className="text-3xl font-medium">{config.title}</p>
      {data && (
        <CrudTable
          data={data.results}
          type={config.type}
          childEntities={
            'childEntitiesMeta' in (data ?? {}) &&
            (data as any)?.childEntitiesMeta
          }
          getId={(b) => b.id}
          onChildNavigatePath={(path) => {
            navigate(window.location.pathname + path);
          }}
        />
      )}
    </>
  );
};

export default AdminEntityPage;
