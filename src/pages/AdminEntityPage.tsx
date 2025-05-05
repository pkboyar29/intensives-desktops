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
import { AdminBreadcrumb, ParentFields } from '../ts/types/types';
import { useLazyGetBreadcrumbQuery } from '../redux/api/breadcrumbApi';
import Modal from '../components/common/modals/Modal';
import AdminEntryModal from '../components/common/modals/AdminEntryModal';
import AdminCreateEntityModal from '../components/common/modals/AdminEntryModal';

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
  const [
    createEntityAPI,
    { data: createEntityData, isError: createEntityError },
  ] = createHook();
  const [
    updateEntityAPI,
    { data: updateEntityData, isError: updateEntityError },
  ] = updateHook();
  const [deleteEntityAPI] = deleteHook();

  const [fetchBreadcrumbsData, { data: breadcrumbsData }] =
    useLazyGetBreadcrumbQuery();

  const [data, setData] = useState(() => queryData?.results ?? []);
  const [breadcrumbs, setBreadcrumbs] = useState<AdminBreadcrumb[]>([]);
  const [isEntryModal, setIsEntryModal] = useState<boolean>(false);

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
    lazyLoadBreadcrumbsData();
    createBreadcrumbs();
  }, []);

  useEffect(() => {
    if (breadcrumbsData) {
      const breadcrumbsMap = Object.fromEntries(
        // записать это
        breadcrumbsData.results.map((b) => [`${b.name}${b.id}`, b])
      );

      setBreadcrumbs(
        breadcrumbs.map((breadcrumb) =>
          breadcrumbsMap[breadcrumb.entityName]
            ? {
                ...breadcrumb,
                label: breadcrumbsMap[breadcrumb.entityName].label,
              }
            : breadcrumb
        )
      );
    }
  }, [breadcrumbsData]);

  useEffect(() => {
    if (queryData) {
      if (offset.current > 0) {
        setData((prev) => [...prev, ...queryData.results]);
      } else {
        setData(queryData.results);
      }
    }
  }, [queryData]);

  useEffect(() => {
    //console.log(data);
    //console.log(queryData?.results);
    //console.log((queryData as any)?.childEntitiesMeta);
  }, [data]);

  useEffect(() => {
    const newEntity = createEntityData || updateEntityData;
    //console.log(newEntity);
    if (createEntityData) {
      setData((prevData) => [...prevData, createEntityData]);
    } else if (updateEntityData) {
      setData((prevData) =>
        prevData.map((item) =>
          item.id === updateEntityData.id
            ? { ...item, ...updateEntityData }
            : item
        )
      );
    }
  }, [createEntityData || updateEntityData]);

  const loadData = async () => {
    if (fetchData) {
      await fetchData({
        ...paramsFromUrl,
        ...paramsFromConfig,
        limit: limit,
        offset: offset.current,
      });
    }
  };

  const lazyLoadBreadcrumbsData = async () => {
    const pathParts = window.location.pathname.split('/');

    for (var pathPart of pathParts) {
      if (!entitiesConfig[pathPart] && !isNaN(parseInt(pathPart))) {
        await fetchBreadcrumbsData({ path: window.location.pathname });
        break;
      }
    }
  };

  const createEntity = async (entity: any) => {
    //const prevItems = [...data]; // сохраняем стейт

    // заменяем строку измененной
    //setData((prevData) => [...prevData, entity]);

    try {
      await createEntityAPI({
        ...entity,
        type: paramsFromConfig.type,
      } as any).unwrap();
    } catch (error: any) {
      //setData(prevItems); // в случае ошибки откатываем состояние
      toast(`Произошла ошибка при создании объекта "${entity.name}"`, {
        type: 'error',
      });
    }
  };

  const updateEntity = async (entity: any) => {
    const prevItems = [...data]; // сохраняем стейт

    // заменяем строку измененной
    setData((prevData) =>
      prevData.map((item) =>
        item.id === entity.id ? { ...item, ...entity } : item
      )
    );
    // Если ничего не изменили запрос не отправляем

    try {
      //cringe
      if (paramsFromConfig.type) {
        await updateEntityAPI({
          type: paramsFromConfig.type,
          object: { ...entity },
        } as any).unwrap();
      } else {
        await updateEntityAPI({ ...entity }).unwrap();
        console.log(data);
      }

      toast(`Объект "${entity.name}" обновлен`, {
        type: 'success',
      });
    } catch (error: any) {
      console.error(
        `Error on updating entity ${entityType} id=${entity.id}`,
        error
      );
      setData(prevItems); // в случае ошибки откатываем состояние
      toast(`Произошла ошибка при обновлении объекта "${entity.name}"`, {
        type: 'error',
      });
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
        prevData.filter((entities) => entities.id !== entity.id)
      );

      toast(`Объект "${entity.name}" успешно удален`, {
        type: 'success',
      });
    } catch (error: any) {
      console.error(
        `Error on deleting entity ${entityType} id=${entity.id}`,
        error
      );
      // заменить на 400?
      if (error.originalStatus === 500) {
        toast(`Нельзя удалить: объект "${entity.name}" используется в связях`, {
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

  const createBreadcrumbs = () => {
    const pathParts = window.location.pathname.split('/');
    pathParts.forEach((pathPart, index) => {
      if (pathPart.length === 0 || pathPart === 'admin') return;

      const entity = entitiesConfig[pathPart];

      setBreadcrumbs((prev) => [
        ...prev,
        {
          // Если id устанавливаем name = pathPart + его id в url, например university1 при university/1
          entityId: entity ? undefined : pathPart,
          entityName: entity ? pathPart : `${pathParts[index - 1]}${pathPart}`,
          urlPath: entity && pathParts.slice(0, index + 1).join('/'),
          label: entity?.title || pathPart,
        },
      ]);
    });
  };

  const getDefaultParentFields = (): ParentFields | undefined => {
    const bcLenght = breadcrumbs.length;

    if (bcLenght > 2) {
      const breadcrumbParent = breadcrumbs[breadcrumbs.length - 2];
      let breadcrumbGrandparent = undefined;
      if (!breadcrumbParent.entityId) return undefined;
      if (!breadcrumbParent.label) return undefined;
      if (!config.queryParamsDependencies) return undefined;

      if (bcLenght > 4) {
        breadcrumbGrandparent = breadcrumbs[breadcrumbs.length - 4];
        if (!breadcrumbParent.entityId) breadcrumbGrandparent = undefined;
      }

      return {
        [config.queryParamsDependencies[0].as]: {
          id: breadcrumbParent.entityId,
          name: breadcrumbParent.label,
          grandparentId: breadcrumbGrandparent?.entityId,
        },
      };
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      {isEntryModal && (
        <AdminCreateEntityModal
          type={config.type}
          defaultParentFields={getDefaultParentFields()}
          entityParentId={undefined}
          onCreate={(entity) => {
            createEntity(entity);
            setIsEntryModal(false);
          }}
          onClose={() => setIsEntryModal(false)}
        />
      )}
      <title>{config.title}</title>
      <div className="flex flex-col items-start">
        <p className="text-3xl font-medium">{config.title}</p>

        <div className="flex mt-3">
          {breadcrumbs.length > 1 &&
            breadcrumbs.map((breadcrumb, index, arr) => (
              <div key={breadcrumb.entityName} className="flex">
                <p
                  className={`${
                    breadcrumb.urlPath &&
                    index !== arr.length - 1 &&
                    `text-blue hover:text-dark_blue cursor-pointer duration-75`
                  }  ${index === arr.length - 1 && `font-semibold`}`}
                  onClick={() =>
                    breadcrumb.urlPath && navigate(breadcrumb.urlPath)
                  }
                >
                  {breadcrumb.label}
                </p>
                {index !== arr.length - 1 && <p className="px-1">{'>'}</p>}
              </div>
            ))}
        </div>

        <button
          className="px-2 py-2 mt-5 duration-100 bg-green-300 rounded-md hover:bg-green-400"
          onClick={() => setIsEntryModal(true)}
        >
          ➕
        </button>
      </div>
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
        isLoadingData={isLoading}
      />
    </>
  );
};

export default AdminEntityPage;
