import React, { FC, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getDateTimeDisplay } from '../helpers/dateHelpers';

import { IEventMark } from '../ts/interfaces/IEventMark';
import { IMarkStrategy } from '../ts/interfaces/IMarkStrategy';
import { TableType } from '../tableConfigs';
import {
  useGetRelatedListAdvancedQuery,
  useLazyGetRelatedListAdvancedQuery,
  useLazyGetRelatedListQuery,
} from '../redux/api/relatedListApi';
import {
  IParentInfo,
  IRelatedList,
  IKeyInfo,
  IRelatedListAdvanced,
  IRelatedListResult,
} from '../ts/interfaces/IRelatedList';
import { EntityShort } from '../ts/types/types';

type RelatedKeysListProps = {
  entity: TableType;
  entityId?: string | number;
  entityParentId?: string | number;
  parentKey: string;
  defaultValue?: string;
  advanced?: boolean;
  onChange: (parentEntity: EntityShort | undefined) => void;
};

const RelatedKeysList: FC<RelatedKeysListProps> = ({
  entity,
  entityId,
  entityParentId,
  parentKey,
  defaultValue,
  advanced = false,
  onChange,
}) => {
  //const [getListById, { data: listDataById, isLoading: loadingListById }] =
  //  useLazyGetRelatedListByIdQuery();

  const [getList, { data: listData, isLoading: loadingList }] =
    useLazyGetRelatedListQuery();

  const [
    getListAdvanced,
    { data: listDataAdvanced, isLoading: loadingListAdvanced },
  ] = useLazyGetRelatedListAdvancedQuery();

  const limit = 300; // Размер страницы данных
  const [offset, setOffset] = useState(0); // Текущее смешещение
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null); // Ссылка на сам список
  const dropdownButtonRef = useRef<HTMLDivElement>(null); // Ссылка на кнопку меню

  //const [relatedList, setRelatedList] = useState<IRelatedList>();
  const [relatedListAdvanced, setRelatedListAdvanced] =
    useState<IRelatedListAdvanced>();
  const [resultsList, setResultsList] = useState<IRelatedListResult[]>([]);
  const [currentLabel, setCurrentLabel] = useState<string>(defaultValue ?? '—');
  const [currentParentKey, setCurrentParentKey] = useState<string | undefined>(
    parentKey
  );

  useEffect(() => {
    if (listData) {
      setResultsList(listData.relatedList.results);
      //setRelatedList(listData.relatedList);
    }
  }, [listData]);

  useEffect(() => {
    if (
      listDataAdvanced &&
      listDataAdvanced.relatedListAdvanced.results.length > 0
    ) {
      setCurrentParentKey(listDataAdvanced.relatedListAdvanced.keyInfo.name);

      setResultsList(listDataAdvanced.relatedListAdvanced.results);
      setRelatedListAdvanced(listDataAdvanced.relatedListAdvanced);
    }
  }, [listDataAdvanced]);

  // Закрытие списка при клике вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !dropdownRef.current?.contains(event.target as Node) && // Если клик не внутри меню
        !dropdownButtonRef.current?.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    if (isOpenDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpenDropdown]);

  // Закрытие списка при прокрутке
  useEffect(() => {
    const handleScroll = (event: Event) => {
      if (
        !dropdownRef.current?.contains(event.target as Node) &&
        !dropdownButtonRef.current?.contains(event.target as Node)
      ) {
        //console.log('tuta');
      }
      //closeDropdown();
    };

    if (isOpenDropdown) {
      // Обработчик для всего окна
      window.addEventListener('scroll', handleScroll, true); // true — для захвата событий
    } else {
      window.removeEventListener('scroll', handleScroll, true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpenDropdown]);

  const closeDropdown = () => setIsOpenDropdown(false);

  const loadData = () => {
    if (entityId && entityParentId === undefined && advanced) {
      getListAdvanced({
        entity: entity,
        entityId,
        key: parentKey,
        type: 'parent',
      });
    } else if (entityId === undefined || entityParentId) {
      getList({
        entity: entity,
        key: parentKey,
        key_parent_id: entityParentId,
      });
    }
  };

  const loadRelatedListAdvanced = async () => {
    if (relatedListAdvanced && relatedListAdvanced.parentInfo) {
      //setCurrentParentKey(relatedListAdvanced.parentInfo.key);
      getListAdvanced({
        entity: relatedListAdvanced?.keyInfo.urlPath,
        entityId: resultsList[0].id, // можно просто брать любой элемент
        key: relatedListAdvanced.parentInfo.key,
        type: 'parent',
      });
    }
  };

  const loadRelatedListChildren = async (relatedId: number | string) => {
    if (relatedListAdvanced && relatedListAdvanced.childInfo) {
      //setCurrentParentKey(relatedListAdvanced.childInfo.key);
      getListAdvanced({
        entity: relatedListAdvanced?.keyInfo.urlPath,
        entityId: relatedId,
        key: relatedListAdvanced.childInfo.key,
        type: 'children',
      });
    }
  };

  const toggleDropdown = () => {
    if (!isOpenDropdown && dropdownButtonRef.current) {
      loadData();
      const rect = dropdownButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY, // Верхняя координата
        left: rect.left + window.scrollX, // Левая координата
      });
    }

    setIsOpenDropdown((prev) => !prev);
  };

  return (
    <>
      <div
        className="bg-white border border-black cursor-pointer"
        onClick={() => toggleDropdown()}
        ref={dropdownButtonRef}
      >
        {currentLabel}
      </div>
      {isOpenDropdown &&
        createPortal(
          <div
            style={{
              position: 'absolute',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              zIndex: 1000,
            }}
            ref={dropdownRef}
            className="text-lg bg-white border border-black"
          >
            {relatedListAdvanced?.parentInfo && (
              <div className="flex px-2 py-2 bg-neutral-200">
                <button
                  className="mr-3 duration-75 hover:text-blue"
                  onClick={() => loadRelatedListAdvanced()}
                >
                  ↩
                </button>
                <p className="">{relatedListAdvanced.parentInfo.name}</p>
              </div>
            )}
            <ul
              id={'relatedList'}
              className="border overflow-y-auto max-h-[150px]"
            >
              {loadingList && <p>Загрузка...</p>}

              {parentKey === currentParentKey && (
                <li
                  className="px-1 py-1 text-center duration-100 bg-white cursor-pointer hover:text-blue"
                  onClick={() => {
                    onChange(undefined);
                    setCurrentLabel('—');
                    setIsOpenDropdown(false);
                  }}
                >
                  —
                </li>
              )}
              <hr></hr>
              {resultsList.map((related) => (
                <div key={related.id} className="flex items-center border-b">
                  <li
                    value={related.id}
                    onClick={() => {
                      if (parentKey === currentParentKey) {
                        onChange({ id: related.id, name: related.name });
                        setCurrentLabel(related.name);
                        setIsOpenDropdown(false);
                      } else {
                        loadRelatedListChildren(related.id);
                      }
                    }}
                    className={`px-3 py-3 ${
                      parentKey === currentParentKey &&
                      `duration-100 bg-white cursor-pointer hover:text-blue`
                    }`}
                  >
                    {related.name}
                  </li>
                  {parentKey !== currentParentKey && (
                    <div
                      onClick={() => loadRelatedListChildren(related.id)}
                      className="mr-2 text-xl duration-75 cursor-pointer hover:text-blue"
                    >
                      ➜
                    </div>
                  )}
                </div>
              ))}
            </ul>
          </div>,
          document.body
        )}
    </>
  );
};

export default RelatedKeysList;
