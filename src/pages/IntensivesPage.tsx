import { FC, useEffect, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '../redux/store';
import { useGetIntensivesQuery } from '../redux/api/intensiveApi';

import { IIntensive } from '../ts/interfaces/IIntensive';
import {
  isUserManager,
  isUserStudent,
  isUserTeacher,
} from '../helpers/userHelpers';

import SearchIcon from '../components/icons/SearchIcon';
import IntensiveCard from '../components/IntensiveCard';
import Table from '../components/common/Table';
import Title from '../components/common/Title';
import PrimaryButton from '../components/common/PrimaryButton';
import Filter from '../components/common/Filter';
import Skeleton from 'react-loading-skeleton';

const IntensivesPage: FC = () => {
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.user.data);

  const { data: intensives, isLoading } = useGetIntensivesQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !currentUser,
  });
  const [filteredIntensives, setFilteredIntensives] = useState<IIntensive[]>(
    []
  );
  const [sortedIntensives, setSortedIntensives] = useState<IIntensive[]>([]);

  const [searchText, setSearchText] = useState<string>('');
  const [sortOption, setSortOption] = useState<'fromOldToNew' | 'fromNewToOld'>(
    'fromOldToNew'
  );

  const [openness, setOpenness] = useState<'closed' | 'opened' | 'all'>('all');
  const [relevance, setRelevance] = useState<'relevant' | 'past' | 'all'>(
    'all'
  );

  // обрабатывать зависимость relevance
  useEffect(() => {
    updateFilteredIntensives();
  }, [searchText, openness, relevance, intensives]);

  useEffect(() => {
    updateSortedIntensives();
  }, [sortOption, filteredIntensives]);

  // TODO: обрабатывать relevance
  const updateFilteredIntensives = () => {
    if (intensives) {
      let filteredIntensives: IIntensive[] = [];

      filteredIntensives = intensives.filter((intensive) =>
        intensive.name.toLowerCase().includes(searchText)
      );

      if (currentUser?.currentRole && isUserManager(currentUser.currentRole)) {
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
      }

      if (relevance === 'relevant') {
        filteredIntensives = filteredIntensives.filter(
          (intensive) => intensive.closeDate.getTime() > Date.now()
        );
      }

      if (relevance === 'past') {
        filteredIntensives = filteredIntensives.filter(
          (intensive) => intensive.closeDate.getTime() < Date.now()
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

  const intensiveClickHandler = (id: number) => {
    if (currentUser && currentUser.currentRole) {
      if (isUserStudent(currentUser.currentRole)) {
        navigate(`/student/${id}/overview`);
      } else if (isUserManager(currentUser.currentRole)) {
        navigate(`/manager/${id}/overview`);
      } else if (isUserTeacher(currentUser.currentRole)) {
        localStorage.removeItem('tutorTeamId');
        navigate(`/teacher/${id}/overview`);
      }
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4">
      <div className="mt-10">
        <Title text="Интенсивы" />

        <div className="mt-10">
          {currentUser?.currentRole &&
            isUserManager(currentUser.currentRole) && (
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

        <div className="flex items-center w-full px-4 py-3 mt-3 bg-another_white rounded-xl">
          <SearchIcon className="text-gray-500" />
          <input
            value={searchText}
            onChange={searchInputChangeHandler}
            className="w-full pl-4 bg-another_white focus:outline-none"
            placeholder="Поиск"
          />
        </div>

        <div className="flex items-center justify-between gap-8 mt-5">
          <div className="flex gap-8">
            {currentUser?.currentRole &&
              isUserManager(currentUser.currentRole) && (
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

        <div className="mt-10">
          {isLoading ? (
            <Skeleton />
          ) : intensives?.length === 0 ? (
            <div className="text-xl font-bold">
              Для вас нету открытых интенсивов
            </div>
          ) : (
            <>
              {sortedIntensives.length !== 0 ? (
                currentUser?.currentRole &&
                isUserManager(currentUser.currentRole) ? (
                  <Table
                    onClick={intensiveClickHandler}
                    columns={columns}
                    data={sortedIntensives}
                  />
                ) : (
                  <div className="flex flex-col gap-4">
                    {sortedIntensives.map((intensive) => (
                      <IntensiveCard
                        key={intensive.id}
                        intensive={intensive}
                        onClick={intensiveClickHandler}
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className="text-xl font-bold">Ничего не найдено</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntensivesPage;
