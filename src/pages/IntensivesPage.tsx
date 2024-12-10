import { FC, useEffect, useState, useRef } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '../redux/store';
import { useGetIntensivesQuery } from '../redux/api/intensiveApi';

import { IIntensive } from '../ts/interfaces/IIntensive';

import UpArrowIcon from '../components/icons/UpArrowIcon';
import DownArrowIcon from '../components/icons/DownArrowIcon';
import Table from '../components/Table';
import Title from '../components/Title';
import PrimaryButton from '../components/PrimaryButton';
import Skeleton from 'react-loading-skeleton';

const IntensivesPage: FC = () => {
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.user.data);

  const { data: intensives, isLoading } = useGetIntensivesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [filteredIntensives, setFilteredIntensives] = useState<IIntensive[]>(
    []
  );
  const [sortedIntensives, setSortedIntensives] = useState<IIntensive[]>([]);

  const [searchText, setSearchText] = useState<string>('');
  const [openness, setOpenness] = useState<'closed' | 'opened' | 'all'>('all');
  const [sortOption, setSortOption] = useState<'fromOldToNew' | 'fromNewToOld'>(
    'fromOldToNew'
  );

  const openedRef = useRef<HTMLDivElement>(null);
  const closedRef = useRef<HTMLDivElement>(null);
  const allRef = useRef<HTMLDivElement>(null);
  const [activeOptionWidth, setActiveOptionWidth] = useState<number>(0);
  const [activeOptionOffset, setActiveOptionOffset] = useState<number>(0);

  useEffect(() => {
    const updateActiveOptionSlug = () => {
      let activeRef = null;
      if (openness === 'opened') activeRef = openedRef.current;
      if (openness === 'closed') activeRef = closedRef.current;
      if (openness === 'all') activeRef = allRef.current;

      if (activeRef) {
        const { offsetWidth, offsetLeft } = activeRef;
        setActiveOptionWidth(offsetWidth);
        setActiveOptionOffset(offsetLeft);
      }
    };

    updateActiveOptionSlug();
  }, [openness, allRef.current]);

  useEffect(() => {
    updateFilteredIntensives();
  }, [searchText, openness, intensives]);

  useEffect(() => {
    updateSortedIntensives();
  }, [sortOption, filteredIntensives]);

  const updateFilteredIntensives = () => {
    if (intensives) {
      let filteredIntensives: IIntensive[] = [];

      filteredIntensives = intensives.filter((intensive) =>
        intensive.name.toLowerCase().includes(searchText)
      );

      if (openness === 'opened') {
        filteredIntensives = filteredIntensives.filter(
          (intensive) => intensive.isOpen
        );
      }
      if (openness === 'closed') {
        filteredIntensives = filteredIntensives.filter(
          (intensive) => !intensive.isOpen
        );
      }

      setFilteredIntensives(filteredIntensives);
    }
  };

  const updateSortedIntensives = () => {
    if (filteredIntensives) {
      if (sortOption === 'fromOldToNew') {
        // сортировка по возрастанию
        setSortedIntensives(
          [...filteredIntensives].sort(
            (a, b) => a.openDate.getTime() - b.openDate.getTime()
          )
        );
      } else if (sortOption === 'fromNewToOld') {
        // сортировка по убыванию
        setSortedIntensives(
          [...filteredIntensives].sort(
            (a, b) => b.openDate.getTime() - a.openDate.getTime()
          )
        );
      }
    }
  };

  const searchInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const selectChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as 'fromOldToNew' | 'fromNewToOld');
  };

  const columnHelper = createColumnHelper<IIntensive>();
  const columns = [
    columnHelper.accessor('id', {
      header: () => 'ID',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: () => 'Название',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('openDate', {
      header: () => 'Начало интенсива',
      cell: (info) => info.getValue().toLocaleDateString(),
    }),
    columnHelper.accessor('closeDate', {
      header: () => 'Конец интенсива',
      cell: (info) => info.getValue().toLocaleDateString(),
    }),
    columnHelper.accessor('flows', {
      header: () => 'Участники',
      cell: (info) =>
        info
          .getValue()
          .map((flow) => `Поток ${flow.name}`)
          .join(', '),
    }),
  ];

  // TODO: мы же изначально будем текущую роль пользователя знать? значит надо будет сранивать с ней, а не просто с существующими ролями
  const intensiveClickHandler = (id: number) => {
    if (currentUser?.roleNames.includes('Студент')) {
      navigate(`/student/${id}/overview`);
    } else if (currentUser?.roleNames.includes('Организатор')) {
      navigate(`/manager/${id}/overview`);
    } else if (currentUser?.roleNames.includes('Преподаватель')) {
      navigate(`/teacher/${id}/overview`);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto">
        <div className="mt-3 font-sans text-2xl font-bold">
          <Skeleton />
        </div>
      </div>
    );
  }

  if (!intensives && !isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto">
        <Title text="Для вас пока нету открытых интенсивов" />
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4">
      <div className="mt-10">
        <Title text="Интенсивы" />

        <div className="mt-10">
          {currentUser?.roleNames.includes('Организатор') && (
            <div className="flex justify-end">
              <div className="ml-auto">
                <PrimaryButton
                  children="Создать интенсив"
                  clickHandler={() => navigate(`/createIntensive`)}
                />
              </div>
            </div>
          )}
        </div>

        <input
          value={searchText}
          onChange={searchInputChangeHandler}
          className="w-full px-4 py-3 mt-3 bg-another_white rounded-xl"
          placeholder="Поиск"
        />

        <div className="flex items-center gap-8 mt-5">
          {currentUser?.roleNames.includes('Организатор') && (
            <div className="relative inline-flex gap-8 pb-2 border-b border-black border-solid">
              <div
                className={`absolute -bottom-[2px] h-[3px] rounded-lg bg-blue transition-all duration-300 ease-in-out`}
                style={{
                  width: `${activeOptionWidth}px`,
                  left: `${activeOptionOffset}px`,
                }}
              ></div>

              <div
                ref={openedRef}
                onClick={() => setOpenness('opened')}
                className={`text-base transition duration-300 ease-in-out cursor-pointer hover:text-blue ${
                  openness === 'opened' && 'text-blue'
                }`}
              >
                Открытые
              </div>
              <div
                ref={closedRef}
                onClick={() => setOpenness('closed')}
                className={`text-base transition duration-300 ease-in-out cursor-pointer hover:text-blue ${
                  openness === 'closed' && 'text-blue'
                }`}
              >
                Закрытые
              </div>
              <div
                ref={allRef}
                onClick={() => setOpenness('all')}
                className={`text-base transition duration-300 ease-in-out cursor-pointer hover:text-blue ${
                  openness === 'all' && 'text-blue'
                }`}
              >
                Все
              </div>
            </div>
          )}

          <select
            onChange={selectChangeHandler}
            value={sortOption}
            className="bg-another_white rounded-xl p-1.5"
          >
            <option value="fromOldToNew">
              Сортировка по дате (сначала старые)
            </option>
            <option value="fromNewToOld">
              Сортировка по дате (сначала новые)
            </option>
          </select>
        </div>

        <div className="mt-10">
          {sortedIntensives.length !== 0 ? (
            <Table
              onClick={intensiveClickHandler}
              columns={columns}
              data={sortedIntensives}
            />
          ) : (
            <div className="text-xl font-bold">Ничего не найдено</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntensivesPage;
