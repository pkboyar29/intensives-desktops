import { FC, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getDateTimeDisplay } from '../helpers/dateHelpers';

import { IEventMark } from '../ts/interfaces/IEventMark';
import { IMarkStrategy } from '../ts/interfaces/IMarkStrategy';
import { TableType } from '../tableConfigs';
import {
  useLazyGetRelatedListByIdQuery,
  useLazyGetRelatedListQuery,
} from '../redux/api/relatedListApi';
import { IParent, IRelatedList } from '../ts/interfaces/IRelatedList';
import { EntityShort } from '../ts/types/types';

type RelatedKeysListProps = {
  entity: TableType;
  entityId?: string | number;
  entityParentId?: string | number;
  parent: string;
  defaultValue?: string;
  onChange: (parentEntity: EntityShort | undefined) => void;
};

const RelatedKeysList: FC<RelatedKeysListProps> = ({
  entity,
  entityId,
  entityParentId,
  parent,
  defaultValue,
  onChange,
}) => {
  //const [getListById, { data: listDataById, isLoading: loadingListById }] =
  //  useLazyGetRelatedListByIdQuery();

  const [getList, { data: listData, isLoading: loadingList }] =
    useLazyGetRelatedListQuery();

  const limit = 300; // Размер страницы данных
  const [offset, setOffset] = useState(0); // Текущее смешещение
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null); // Ссылка на кнопку меню

  const [relatedList, setRelatedList] = useState<IRelatedList[]>([]);
  const [currentEntity, setCurrentEntity] = useState<TableType>(entity);
  const [currentLabel, setCurrentLabel] = useState<string>(defaultValue ?? '—');
  const [parentEntity, setParentEntity] = useState<IParent | null>();
  const [grandparentEntity, setGrandparentEntity] = useState<IParent | null>();

  useEffect(() => {
    //console.log(entityId, entityParentId);
  }, []);

  useEffect(() => {
    if (listData) {
      setRelatedList(listData?.results);
      setParentEntity(listData.parentInfo);
      setGrandparentEntity(listData.grandparentInfo);
    }
  }, [listData]);

  const loadData = () => {
    if (entityId && entityParentId === undefined) {
      getList({ entity: currentEntity, entityId, key: parent });
    } else if (entityId === undefined || entityParentId) {
      getList({
        entity: currentEntity,
        key: parent,
        key_parent_id: entityParentId,
      });
    }
  };

  const loadRelatedList = async () => {
    if (parentEntity) {
      await getList({
        entity: parentEntity?.path,
        entityId: parentEntity?.id,
        key: 'university',
      });
    }
  };

  const loadOrChange = () => {};

  const toggleDropdown = () => {
    if (!isOpenDropdown && dropdownRef.current) {
      loadData();
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY - 20, // Верхняя координата
        left: rect.left + window.scrollX, // Левая координата
      });
    }

    setIsOpenDropdown((prev) => !prev);
  };
  //console.log(entityParentId);

  return (
    // показывать стрелочку вправо у объектов переходв
    <>
      {grandparentEntity && (
        <div className="flex">
          <button className="hover:text-blue" onClick={() => loadRelatedList()}>
            ↩
          </button>
          <p>{grandparentEntity?.name}</p>
        </div>
      )}

      <div
        className="bg-white border border-black cursor-pointer"
        onClick={() => toggleDropdown()}
        ref={dropdownRef}
      >
        {currentLabel}
        {isOpenDropdown &&
          createPortal(
            <ul
              id={'relatedList'}
              className="mt-5 border border-black overflow-y-auto max-h-[100px]"
              style={{
                position: 'absolute',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                zIndex: 1000,
              }}
            >
              {loadingList && <p>Загрузка...</p>}

              <li
                className="px-2 py-2 text-center duration-100 bg-white cursor-pointer hover:text-blue"
                onClick={() => {
                  onChange(undefined);
                  setCurrentLabel('—');
                }}
              >
                —
              </li>
              <hr></hr>
              {relatedList.map((related) => (
                <div key={related.id}>
                  <li
                    value={related.id}
                    onClick={() => {
                      onChange({ id: related.id, name: related.name });
                      setCurrentLabel(related.name);
                    }}
                    className="px-2 py-2 duration-100 bg-white cursor-pointer hover:text-blue"
                  >
                    {related.name}
                  </li>
                  <hr></hr>
                </div>
              ))}
            </ul>,
            document.body
          )}
      </div>
    </>
  );
};

export default RelatedKeysList;
