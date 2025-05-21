import { FC, useEffect, useRef, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '../redux/store';
import { useLazyGetIntensivesQuery } from '../redux/api/intensiveApi';

import { IIntensiveShort } from '../ts/interfaces/IIntensive';
import { isUserManager, isUserTeacher } from '../helpers/userHelpers';

import { Helmet } from 'react-helmet-async';
import SearchBar from '../components/common/SearchBar';
import IntensiveCard from '../components/IntensiveCard';
import Table from '../components/common/Table';
import Title from '../components/common/Title';
import PrimaryButton from '../components/common/PrimaryButton';
import Filter from '../components/common/Filter';
import Skeleton from 'react-loading-skeleton';
import PagionationButtonPages from '../components/PaginationButtonPages';

const IntensivesPage: FC = () => {
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.user.data);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [getIntensives, { data, isLoading, isUninitialized }] =
    useLazyGetIntensivesQuery();
  const intensives = data?.results ?? [];
  const pagesCount = data ? Math.ceil(data.count / 10) : 0; // TODO: мы тут на 0 разделить можем?

  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [searchText, setSearchText] = useState<string>('');
  const startTypingRef = useRef<boolean>(false);

  const [sortOption, setSortOption] = useState<'fromOldToNew' | 'fromNewToOld'>(
    'fromOldToNew'
  );
  const [openness, setOpenness] = useState<'closed' | 'opened' | 'all'>('all');
  const [relevance, setRelevance] = useState<'relevant' | 'past' | 'all'>(
    'relevant'
  );

  useEffect(() => {
    if (currentUser?.currentRole) {
      loadPage(currentPage);
    }
  }, [currentPage, currentUser?.currentRole]);

  useEffect(() => {
    if (startTypingRef.current) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const timeoutId = setTimeout(() => {
        if (currentPage != 1) {
          setCurrentPage(1);
        } else {
          loadPage(1);
        }
      }, 500);
      timerRef.current = timeoutId;
    }
  }, [searchText]);

  useEffect(() => {
    // TODO: убрать это условие или заменить его на что-то нормальное?
    if (currentUser?.currentRole) {
      if (currentPage != 1) {
        setCurrentPage(1);
      } else {
        loadPage(1);
      }
    }
  }, [openness, relevance, sortOption]);

  const loadPage = (page: number) => {
    getIntensives({
      isMentor: currentUser?.currentRole?.name === 'Mentor',
      page,
      search: searchText,
      openness,
      relevance,
      sortOption,
    });
  };

  const searchInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTypingRef.current = true;
    setSearchText(e.target.value);
  };

  const selectChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as 'fromOldToNew' | 'fromNewToOld');
  };

  const columnHelper = createColumnHelper<IIntensiveShort>();
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

  const intensiveClickHandler = (id: number) => {
    if (isUserTeacher(currentUser) || isUserManager(currentUser)) {
      sessionStorage.removeItem('currentTeam');
    }

    navigate(`/intensives/${id}/overview`);
  };

  return (
    <>
      <Helmet>
        <title>Интенсивы | {import.meta.env.VITE_SITE_NAME}</title>
      </Helmet>

      <div className="pt-[88px] pb-10 min-h-screen overflow-y-auto max-w-[1280px] mx-auto px-4">
        <Title text="Интенсивы" />

        <div className="mt-4 sm:mt-8">
          {isUserManager(currentUser) && (
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

        <SearchBar
          searchText={searchText}
          searchInputChangeHandler={searchInputChangeHandler}
        />

        <div className="flex flex-wrap justify-center gap-4 mt-5 sm:justify-between sm:gap-8">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {isUserManager(currentUser) && (
              <Filter
                onFilterOptionClick={(filterOption) =>
                  setOpenness(filterOption as 'all' | 'opened' | 'closed')
                }
                activeFilterOption={openness}
                filterList={[
                  { label: 'Открытые', value: 'opened' },
                  { label: 'Закрытые', value: 'closed' },
                  { label: 'Все', value: 'all' },
                ]}
              />
            )}

            <Filter
              onFilterOptionClick={(filterOption) =>
                setRelevance(filterOption as 'all' | 'past' | 'relevant')
              }
              activeFilterOption={relevance}
              filterList={[
                { label: 'Актуальные', value: 'relevant' },
                { label: 'Прошедшие', value: 'past' },
                { label: 'Все', value: 'all' },
              ]}
            />
          </div>

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

        <div className="mt-3 sm:mt-10">
          {isLoading || isUninitialized || !intensives ? (
            <Skeleton />
          ) : intensives.length > 0 ? (
            <>
              <PagionationButtonPages
                countPages={pagesCount}
                countElements={data!.count}
                currentPage={currentPage}
                onClick={(newPage) => setCurrentPage(newPage)}
              />

              {isUserManager(currentUser) ? (
                <Table
                  onClick={intensiveClickHandler}
                  columns={columns}
                  data={intensives}
                />
              ) : (
                <div className="flex flex-col gap-4 mt-6">
                  {intensives.map((intensive) => (
                    <IntensiveCard
                      key={intensive.id}
                      intensive={intensive}
                      onClick={intensiveClickHandler}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-xl font-bold">Ничего не найдено</div>
          )}
        </div>
      </div>
    </>
  );
};

export default IntensivesPage;
