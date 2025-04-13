import { FC, useEffect, useRef, useState } from 'react';
import CrudTable from '../components/CrudTable';
import { useNavigate, useParams } from 'react-router-dom';
import { useLazyGetFlowsQuery } from '../redux/api/flowApi';
import { IFlow } from '../ts/interfaces/IFlow';
import {
  entitiesConfig,
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
    if (fetchData) {
      await fetchData({
        ...paramsFromUrl,
        ...paramsFromConfig,
        limit: limit,
        offset: offset.current,
      });
      //console.log('fetch');
    }
  };

  const updateEntity = async (entity: any) => {
    console.log(entity);
    const prevItems = [...data]; // сохраняем стейт

    // заменяем строку измененной
    setData((prevData) =>
      prevData.map((item) =>
        item.id === entity.id ? { ...item, ...entity } : item
      )
    );

    try {
      console.log(entity);
      await updateEntityAPI({ ...entity }).unwrap();
    } catch (error: any) {
      console.error(
        `Error on updating entity ${entityType} id=${entity.id}`,
        error
      );
      setData(prevItems); // в случае ошибки откатываем состояние
    }
  };

  const deleteEntity = async (entity: any) => {
    try {
      //cringe
      if (paramsFromConfig.type) {
        await deleteEntityAPI({
          id: entity.id,
          type: paramsFromConfig.type,
        } as any).unwrap();
      } else {
        await deleteEntityAPI(entity.id).unwrap();
      }

      setData((prevData) =>
        prevData.filter((entity) => entity.id !== entity.id)
      );
    } catch (error: any) {
      console.error(
        `Error on deleting entity ${entityType} id=${entity.id}`,
        error
      );
      // заменить на 400
      if (error.originalStatus === 500) {
        toast(`Нельзя удалить: объект ${entity.name} используется в связях`, {
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
        onUpdate={(entity) => updateEntity(entity)}
        onDelete={(entity) => deleteEntity(entity)}
      />
    </>
  );
};

export default AdminEntityPage;
