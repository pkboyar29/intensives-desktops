import { FC, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getDateTimeDisplay } from '../helpers/dateHelpers';

import { IEventMark } from '../ts/interfaces/IEventMark';
import { IMarkStrategy } from '../ts/interfaces/IMarkStrategy';
import { TableType } from '../tableConfigs';
import { useLazyGetRelatedListQuery } from '../redux/api/relatedListApi';
import { IParent, IRelatedList } from '../ts/interfaces/IRelatedList';

type RelatedKeysListProps = {
  entity: TableType;
  entityId: string | number;
  parent: string;
  defaultValue: string;
  onChange: (parentId: number | string, parentName: string) => void;
};

const RelatedKeysList: FC<RelatedKeysListProps> = ({
  entity,
  entityId,
  parent,
  defaultValue,
  onChange,
}) => {
  const [getList, { data, isLoading, isError }] = useLazyGetRelatedListQuery();

  const limit = 300; // Размер страницы данных
  const [offset, setOffset] = useState(0); // Текущее смешещение
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null); // Ссылка на кнопку меню

  const [relatedList, setRelatedList] = useState<IRelatedList[]>([]);
  const [currentEntity, setCurrentEntity] = useState<TableType>(entity);
  const [currentLabel, setCurrentLabel] = useState<string>(defaultValue);
  const [parentEntity, setParentEntity] = useState<IParent | null>();
  const [grandparentEntity, setGrandparentEntity] = useState<IParent | null>();

  useEffect(() => {
    getList({ entity: currentEntity, entityId, key: parent });
  }, []);

  useEffect(() => {
    console.log(data);
    if (data) {
      setRelatedList(data?.results);
      setParentEntity(data.parentInfo);
      setGrandparentEntity(data.grandparentInfo);
    }
  }, [data]);

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
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY - 20, // Верхняя координата
        left: rect.left + window.scrollX, // Левая координата
      });
    }

    setIsOpenDropdown((prev) => !prev);
  };

  //console.log(entity, entityId, parent, defaultValue);
  return (
    // показывать стрелочку вправо у объектов переходв
    <>
      <div>
        {grandparentEntity && (
          <div className="flex">
            <button
              className="hover:text-blue"
              onClick={() => loadRelatedList()}
            >
              ↩
            </button>
            <p>{grandparentEntity?.name}</p>
          </div>
        )}

        <div
          className="inline-block w-full border border-black cursor-pointer"
          onClick={() => toggleDropdown()}
          ref={dropdownRef}
        >
          {currentLabel}
          {isOpenDropdown &&
            createPortal(
              <ul
                id={'relatedList'}
                className="mt-5 border border-black "
                style={{
                  position: 'absolute',
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  zIndex: 1000,
                }}
              >
                {relatedList.map((related) => (
                  <>
                    <li
                      key={related.id}
                      value={related.id}
                      onClick={() => {
                        onChange(related.id, related.name);
                        setCurrentLabel(related.name);
                      }}
                      className="px-2 py-2 duration-100 bg-white cursor-pointer hover:text-blue"
                    >
                      {related.name}
                    </li>
                    <hr></hr>
                  </>
                ))}
              </ul>,
              document.body
            )}
        </div>
      </div>
    </>
  );
};

export default RelatedKeysList;
