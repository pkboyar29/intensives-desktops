import { FC, useEffect, useState } from 'react';
import PostService from '../API/PostService';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { IntensivesContext } from '../context/IntensivesContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import Title from '../components/Title';

import { IIntensive } from '../ts/interfaces/IIntensive';

const ManagerIntensiveOverviewPage: FC = () => {
  const { intensiveId } = useParams();
  const navigate = useNavigate();

  const [currentIntensive, setCurrentIntensive] = useState<
    IIntensive | undefined
  >(undefined);
  const { getIntensiveById } = useContext(IntensivesContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDataForManager = async () => {
      if (intensiveId) {
        const currentIntensive: IIntensive = await getIntensiveById(
          parseInt(intensiveId, 10)
        );
        setCurrentIntensive(currentIntensive);
        setIsLoading(false);
      }
    };
    fetchDataForManager();
  }, [intensiveId]);

  const deleteIntensivButtonHandler = () => {
    if (intensiveId) {
      PostService.deleteIntensive(intensiveId);
      navigate('/intensives');
    }
  };

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <div className="flex justify-center min-h-screen min-w-[50vw] max-w-[1280px]">
      <div className="list-content">
        <div className="mb-5">
          {currentIntensive ? (
            <Title text={currentIntensive.name} />
          ) : (
            <Skeleton />
          )}
        </div>
        <div>
          <div className="py-3 text-lg font-bold">
            {currentIntensive ? (
              currentIntensive.open_dt.toLocaleDateString() +
              ' - ' +
              currentIntensive.close_dt.toLocaleDateString()
            ) : (
              <Skeleton />
            )}
          </div>

          <div className="py-3">
            {currentIntensive ? (
              <div className="text-lg">{currentIntensive.description}</div>
            ) : (
              <Skeleton />
            )}
          </div>

          <div className="py-3 text-lg font-bold text-[#121217]">Участники</div>

          <div className="py-3 text-lg">
            <div className="pb-2">Список учебных потоков</div>
            <div className="flex flex-wrap">
              {currentIntensive ? (
                <div className="ml-4 text-sm selectedInList">
                  {currentIntensive.flow}
                </div>
              ) : (
                <Skeleton />
              )}
            </div>
            {/* <div className="py-3 text-lg">
              <div className="pb-2">Список ролей для студентов</div>
              <div className="flex flex-wrap">
                {data ? (
                  data.roles.map((elem) => (
                    <div className="ml-4 text-sm selectedInList">{elem}</div>
                  ))
                ) : (
                  <Skeleton />
                )}
              </div>
            </div> */}
            {/* <div className="py-3 text-lg">
              <div className="pb-2">Список преподавателей</div>
              <div className="flex flex-wrap">
                {data ? (
                  data.teacher_command.lenght ? (
                    data.teacher_command.map((elem) => (
                      <div className="ml-4 text-sm selectedInList">{elem}</div>
                    ))
                  ) : (
                    <div>Преподаватели не выбраны</div>
                  )
                ) : (
                  <Skeleton />
                )}
              </div>
            </div> */}
            <div className="flex gap-2 mt-3 text-lg font-bold">
              <Link
                className="bg-[#1a5ce5] text-white px-4 py-2.5 rounded-[10px] w-full flex justify-center"
                to={`/manager/${intensiveId}/editIntensive`}
              >
                Редактировать
              </Link>

              <button
                className="px-2 py-2.5 rounded-[10px] bg-[#f0f2f5] flex justify-center items-center cursor-pointer"
                onClick={deleteIntensivButtonHandler}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerIntensiveOverviewPage;
