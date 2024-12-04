import { FC, useEffect, useState, useRef } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '../redux/store';
import { useGetIntensivesQuery } from '../redux/api/intensiveApi';

import { IIntensive } from '../ts/interfaces/IIntensive';

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
  const [searchFilteredIntensives, setSearchFilteredIntensives] = useState<
    IIntensive[]
  >([]);
  const [opennessFilteredIntensives, setOpennessFilteredIntensives] = useState<
    IIntensive[]
  >([]);

  const [searchText, setSearchText] = useState<string>('');
  const [openness, setOpenness] = useState<'closed' | 'opened' | 'all'>('all');

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
    updateOpennessFilteredIntensives();
  }, [openness, allRef.current]);

  useEffect(() => {
    if (intensives) {
      setSearchFilteredIntensives(intensives);
      setSearchText('');
    }
  }, [intensives]);

  const updateOpennessFilteredIntensives = () => {
    if (openness === 'opened') {
      setOpennessFilteredIntensives(
        searchFilteredIntensives.filter((intensive) => intensive.isOpen)
      );
    }
    if (openness === 'closed') {
      setOpennessFilteredIntensives(
        searchFilteredIntensives.filter((intensive) => !intensive.isOpen)
      );
    }
    if (openness === 'all') {
      setOpennessFilteredIntensives(searchFilteredIntensives);
    }
  };

  const searchInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (intensives) {
      setSearchText(e.target.value);

      setSearchFilteredIntensives(
        intensives.filter((intensive) =>
          intensive.name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );

      updateOpennessFilteredIntensives();
    }
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

  // TODO: отображать модальное окно с выбором роли, если их несколько
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
    <div className="max-w-[1280px] mx-auto">
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

        <div className="relative inline-flex gap-8 pb-2 mt-5 border-b border-black border-solid">
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
            Актуальные
          </div>
          <div
            ref={closedRef}
            onClick={() => setOpenness('closed')}
            className={`text-base transition duration-300 ease-in-out cursor-pointer hover:text-blue ${
              openness === 'closed' && 'text-blue'
            }`}
          >
            Прошедшие
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

        <div className="mt-10">
          {opennessFilteredIntensives.length !== 0 ? (
            <Table
              onClick={intensiveClickHandler}
              columns={columns}
              data={opennessFilteredIntensives}
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
