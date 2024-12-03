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
import { IFlow } from '../ts/interfaces/IFlow';

const IntensivesPage: FC = () => {
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.user.data);

  const { data: intensives, isLoading } = useGetIntensivesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

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
      cell: (info) =>
        info
          .getValue()
          .map((flow) => flow.name)
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
        <Title text="Интенсивы" />

        {currentUser?.roleNames.includes('Организатор') && (
          <div className="flex justify-end mt-10">
            <div className="ml-auto">
              <PrimaryButton
                children="Создать интенсив"
                clickHandler={() => navigate(`/createIntensive`)}
              />
            </div>
          </div>
        )}

        <input
          value={searchText}
          onChange={searchInputChangeHandler}
          className="w-full px-4 py-3 mt-3 bg-another_white rounded-xl"
          placeholder="Поиск"
        />

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
