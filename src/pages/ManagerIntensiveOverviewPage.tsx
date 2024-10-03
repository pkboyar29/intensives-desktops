import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '../redux/store';
import { useDeleteIntensiveMutation } from '../redux/api/intensiveApi';

import Title from '../components/Title';
import Chip from '../components/Chip';
import PrimaryButton from '../components/PrimaryButton';
import Skeleton from 'react-loading-skeleton';

const ManagerIntensiveOverviewPage: FC = () => {
  const navigate = useNavigate();

  const currentIntensive = useAppSelector((state) => state.intensive.data);
  const [deleteIntensive] = useDeleteIntensiveMutation();

  const deleteIntensivButtonHandler = async () => {
    try {
      if (currentIntensive) {
        await deleteIntensive(currentIntensive.id);

        navigate('/intensives');
      }
    } catch (e) {
      console.log(e);
    }
  };

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

          <div className="py-3 text-lg font-bold text-black_2">Участники</div>

          <div className="flex flex-col gap-3 text-lg">
            <div className="flex flex-col gap-3">
              <div>Список учебных потоков</div>
              {currentIntensive ? (
                <div className="flex flex-wrap gap-3">
                  {currentIntensive.flows.map((flow) => (
                    <Chip key={flow.id} label={flow.name} />
                  ))}
                </div>
              ) : (
                <Skeleton />
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div>Список преподавателей</div>
              {currentIntensive ? (
                <div className="flex flex-wrap gap-3">
                  {currentIntensive.teachersTeam.map((teacherOnIntensive) => (
                    <Chip
                      key={teacherOnIntensive.id}
                      label={teacherOnIntensive.name}
                    />
                  ))}
                </div>
              ) : (
                <Skeleton />
              )}
            </div>

            <div className="flex mt-10 text-lg font-bold gap-7">
              <PrimaryButton
                text="Редактировать"
                clickHandler={() => {
                  navigate(`/manager/${currentIntensive?.id}/editIntensive`);
                }}
              />

              <button
                className="p-4 rounded-[10px] bg-another_white flex justify-center items-center cursor-pointer"
                onClick={deleteIntensivButtonHandler}
              >
                <svg
                  width="19"
                  height="20"
                  viewBox="0 0 23 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.31825 21.9396L2.3 7.2H20.7L18.6818 21.9396C18.6034 22.5115 18.33 23.0347 17.9117 23.4132C17.4935 23.7917 16.9584 24 16.4047 24H6.59525C6.04161 24 5.50654 23.7917 5.08827 23.4132C4.66999 23.0347 4.39659 22.5115 4.31825 21.9396ZM21.85 2.4H16.1V1.2C16.1 0.88174 15.9788 0.576515 15.7632 0.351472C15.5475 0.126428 15.255 0 14.95 0H8.05C7.745 0 7.45249 0.126428 7.23683 0.351472C7.02116 0.576515 6.9 0.88174 6.9 1.2V2.4H1.15C0.845001 2.4 0.552494 2.52643 0.336827 2.75147C0.12116 2.97652 0 3.28174 0 3.6C0 3.91826 0.12116 4.22348 0.336827 4.44853C0.552494 4.67357 0.845001 4.8 1.15 4.8H21.85C22.155 4.8 22.4475 4.67357 22.6632 4.44853C22.8788 4.22348 23 3.91826 23 3.6C23 3.28174 22.8788 2.97652 22.6632 2.75147C22.4475 2.52643 22.155 2.4 21.85 2.4Z"
                    fill="black"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerIntensiveOverviewPage;
