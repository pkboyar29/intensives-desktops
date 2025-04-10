import { FC, useEffect, useRef, useState } from 'react';
import CrudTable from '../components/CrudTable';
import { useNavigate, useParams } from 'react-router-dom';
import { useLazyGetFlowsQuery } from '../redux/api/flowApi';
import { IFlow } from '../ts/interfaces/IFlow';
import {
  entitiesConfig,
  useEntityQueryHook,
  useEntityQueryHooks,
} from '../tableConfigs/entitiesConfig';
import { TableType } from '../tableConfigs';
import { ToastContainer, toast } from 'react-toastify';

interface AdminEntityPageProps {
  entityType: TableType;
}

const AdminEntityPage: FC<AdminEntityPageProps> = ({ entityType }) => {
  const navigate = useNavigate();
  const urlParams = useParams();

  const config = entitiesConfig[entityType as keyof typeof entitiesConfig];
  if (!config) return <div>Unknown entity</div>;

  //const [fetchData, { data: queryData, isLoading, isError }] =
  //  useEntityQueryHooks(entityType, 'view');
  const viewHook = useEntityQueryHooks(entityType, 'view');
  const createHook = useEntityQueryHooks(entityType, 'create');
  const updateHook = useEntityQueryHooks(entityType, 'update');
  const deleteHook = useEntityQueryHooks(entityType, 'delete');

  const [fetchData, { data: queryData, isLoading, isError }] = viewHook();
  const [createEntityAPI] = createHook();
  const [updateEntityAPI] = updateHook();
  const [deleteEntityAPI] = deleteHook();

  const [data, setData] = useState(() => queryData?.results ?? []);

  const limit = 100; // Размер страницы данных
  const offset = useRef<number>(0); // Текущее смещение
  const count = queryData?.count; // Общее количество записей

  const paramsFromUrl: Record<string, string> = {};
  for (const dep of config.queryParamsDependencies ?? []) {
    const value = urlParams[dep.from];
    if (value) {
      paramsFromUrl[dep.as] = value;
      //console.log(dep.from, value);
    }
  }

  const paramsFromConfig = config.defaultQueryParams ?? {};

  useEffect(() => {
    loadData();
  }, [fetchData]);

  useEffect(() => {
    //console.log(queryData);
    if (queryData) {
      setData((prev) => [...prev, ...queryData.results]);
    }
  }, [queryData]);

  useEffect(() => {
    //console.log(data);
    //console.log(queryData?.results);
    //console.log((queryData as any)?.childEntitiesMeta);
  }, [data]);

  const loadData = async () => {
    console.log(paramsFromConfig);
    if (fetchData) {
      await fetchData({
        ...paramsFromUrl,
        ...paramsFromConfig,
        limit: limit,
        offset: offset.current,
      });
      console.log('fetch');
    }
  };

  const deleteEntity = async (id: number) => {
    try {
      //cringe
      if (paramsFromConfig.type) {
        await deleteEntityAPI({
          id,
          type: paramsFromConfig.type,
        } as any).unwrap();
      } else {
        await deleteEntityAPI(id as any).unwrap();
      }

      setData((prevData) => prevData.filter((entity) => entity.id !== id));
    } catch (error: any) {
      console.error(`Error on deleting entity ${entityType} id=${id}`, error);
      if (error.originalStatus === 400) {
        toast('Нельзя удалить - объект используется в связях', {
          type: 'error',
        });
      }
    }
  };

  const loadNextPage = () => {
    offset.current += limit;
    if (count && offset.current < count) {
      loadData();
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <title>{config.title}</title>
      <p className="text-3xl font-medium">{config.title}</p>
      <CrudTable
        data={data}
        type={config.type}
        childEntities={
          'childEntitiesMeta' in (queryData ?? {}) &&
          (queryData as any)?.childEntitiesMeta
        }
        getId={(b) => b.id}
        onChildNavigatePath={(path) => {
          navigate(window.location.pathname + path);
        }}
        onNextPage={count && limit < count ? () => loadNextPage() : undefined}
        onDelete={(entity) => deleteEntity(entity.id)}
      />
    </>
  );
};

export default AdminEntityPage;
