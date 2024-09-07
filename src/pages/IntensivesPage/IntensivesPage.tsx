import { FC, useContext, useEffect, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate, Link } from 'react-router-dom';

import { Intensive } from '../../utils/types/Intensive';
import { IntensivesContext } from '../../context/IntensivesContext';
import { CurrentUserContext } from '../../context/CurrentUserContext';

import Table from '../../components/Table/Table';
import Title from '../../components/Title/Title';

const IntensivesPage: FC = () => {
  const navigate = useNavigate();

  const { intensives, getIntensives } = useContext(IntensivesContext);
  const { currentUser } = useContext(CurrentUserContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser != null) {
        console.log(currentUser.user_role_id);
        getIntensives();
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  const columnHelper = createColumnHelper<Intensive>();
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
      navigate('/intensiv');
    }
    if (currentUser?.user_role_id === 3) {
      localStorage.setItem('id', id.toString());
      navigate(`/teacher/${id}/overview`);
    }
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
            <button className="ml-auto button-classic">
              <Link to={{ pathname: '/createIntensive' }}>
                Создать интенсив
              </Link>
            </button>
          </div>
        )}

        <div className="mt-3">
          <input
            className="w-full py-3 px-4 bg-[#f0f2f5] rounded-xl"
            placeholder="Поиск"
          />
        </div>

        <div className="mt-10">
          <Table
            onClick={intensiveClickHandler}
            columns={columns}
            data={intensives}
          />
        </div>
      </div>
    </div>
  );
};

export default IntensivesPage;
