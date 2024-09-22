import { FC, useContext, useEffect, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate, Link } from 'react-router-dom';

import { IIntensive } from '../ts/interfaces/IIntensive';
import { IntensivesContext } from '../context/IntensivesContext';
import { CurrentUserContext } from '../context/CurrentUserContext';

import Table from '../components/Table';
import Title from '../components/Title';

const IntensivesPage: FC = () => {
  const navigate = useNavigate();

  const { intensives, getIntensives } = useContext(IntensivesContext);
  const [filteredIntensives, setFilteredIntensives] = useState<IIntensive[]>(
    []
  );

  useEffect(() => {
    setFilteredIntensives(intensives);
    setSearchText('');
  }, [intensives]);

  const { currentUser } = useContext(CurrentUserContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser != null) {
        getIntensives();
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  const columnHelper = createColumnHelper<IIntensive>();
  const columns = [
    columnHelper.accessor('id', {
      header: () => 'ID',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: () => 'Наименование',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('open_dt', {
      header: () => 'Начало интенсива',
      cell: (info) => info.getValue().toLocaleDateString(),
    }),
    columnHelper.accessor('close_dt', {
      header: () => 'Конец интенсива',
      cell: (info) => info.getValue().toLocaleDateString(),
    }),
    columnHelper.accessor('flow', {
      header: () => 'Участники',
      cell: (info) => info.getValue(),
    }),
  ];

  const intensiveClickHandler = (id: number) => {
    if (currentUser?.user_role_id === 2) {
      navigate(`/manager/${id}/overview`);
    }
    if (currentUser?.user_role_id === 3) {
      navigate(`/teacher/${id}/overview`);
    }
  };

  const searchInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);

    setFilteredIntensives(
      intensives.filter((intensive) =>
        intensive.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-[1280px]">
        <div className="mt-3 font-sans text-2xl font-bold">Загрузка...</div>
      </div>
    );
  }

  if (intensives.length === 0 && !isLoading) {
    return (
      <div className="max-w-[1280px]">
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

        {currentUser?.user_role_id === 2 && (
          <div className="flex justify-end mt-10">
            <button className="ml-auto text-white bg-[#1a5ce5] py-2 px-4 rounded-xl">
              <Link to="/createIntensive">Создать интенсив</Link>
            </button>
          </div>
        )}

        <div className="mt-3">
          <input
            value={searchText}
            onChange={searchInputChangeHandler}
            className="w-full py-3 px-4 bg-[#f0f2f5] rounded-xl"
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
