import { FC } from 'react';
import { Outlet, Link, useParams } from 'react-router-dom';

import { useGetIntensiveQuery } from '../../redux/api/intensiveApi';

import Sidebar from '../../components/Sidebar';
import Skeleton from 'react-loading-skeleton';

const ManagerMainPage: FC = () => {
  const params = useParams();

  const { data: currentIntensive, isLoading } = useGetIntensiveQuery(
    Number(params.intensiveId)
  );

  return (
    <>
      <div className="flex h-full">
        <Sidebar>
          <div className="w-80">
            {isLoading ? (
              <Skeleton />
            ) : (
              <>
                <div className="text-lg">{currentIntensive?.name}</div>
                <div className="text-[#637087]">
                  {currentIntensive?.open_dt.toLocaleDateString()}
                  {` - `}
                  {currentIntensive?.close_dt.toLocaleDateString()}
                </div>
              </>
            )}

            <div className="flex flex-col gap-4 my-3">
              <Link to="overview" className="py-1.5 px-2.5 hover:bg-[#f0f2f5]">
                Настройки интенсива
              </Link>
              <Link
                to="statistics"
                className="py-1.5 px-2.5 hover:bg-[#f0f2f5]"
              >
                Статистика
              </Link>
              <Link to="teams" className="py-1.5 px-2.5 hover:bg-[#f0f2f5]">
                Управление командами
              </Link>
              <Link to="plan" className="py-1.5 px-2.5 hover:bg-[#f0f2f5]">
                План интенсива
              </Link>
              <Link
                to="manageRoles"
                className="py-1.5 px-2.5 hover:bg-[#f0f2f5]"
              >
                Управление ролями
              </Link>
            </div>
            <Link
              className="block text-center mt-2 px-2 py-4 bg-blue rounded-xl text-white text-[14px] font-inter font-bold"
              to="/intensives"
            >
              Вернуться к списку интенсивов
            </Link>
          </div>
        </Sidebar>
        <div className="w-full p-10">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default ManagerMainPage;
