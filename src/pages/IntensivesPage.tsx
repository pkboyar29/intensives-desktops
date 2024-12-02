import { FC, useEffect, useState } from 'react';
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
  }); // OR REFETCH UNDER SPECIFIC CONDITION?

  const [filteredIntensives, setFilteredIntensives] = useState<IIntensive[]>(
    []
  );

  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    if (intensives) {
      setFilteredIntensives(intensives);
      setSearchText('');
    }
  }, [intensives]);

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
      cell: (info) => info.getValue()[0] && info.getValue()[0].name,
    }),
  ];

  // TODO: проверять наличие элемента в массиве
  const intensiveClickHandler = (id: number) => {
    if (currentUser?.roleNames.find((roleName) => roleName === 'Студент')) {
      navigate(`/student/${id}/overview`);
    } else if (
      currentUser?.roleNames.find((roleName) => roleName === 'Организатор')
    ) {
      navigate(`/manager/${id}/overview`);
    } else if (
      currentUser?.roleNames.find((roleName) => roleName === 'Преподаватель')
    ) {
      navigate(`/teacher/${id}/overview`);
    }
  };

  const searchInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (intensives) {
      setSearchText(e.target.value);

      setFilteredIntensives(
        intensives.filter((intensive) =>
          intensive.name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
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
        <div className="">
          <Title text="Интенсивы" />
        </div>

        {currentUser?.roleNames.find(
          (roleName) => roleName === 'Организатор'
        ) && (
          <div className="flex justify-end mt-10">
            <div className="ml-auto">
              <PrimaryButton
                children="Создать интенсив"
                clickHandler={() => navigate(`/createIntensive`)}
              />
            </div>
          </div>
        )}

        <div className="mt-3">
          <input
            value={searchText}
            onChange={searchInputChangeHandler}
            className="w-full px-4 py-3 bg-another_white rounded-xl"
            placeholder="Поиск"
          />
        </div>

        <div className="mt-10">
          {filteredIntensives.length !== 0 ? (
            <Table
              onClick={intensiveClickHandler}
              columns={columns}
              data={filteredIntensives}
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
