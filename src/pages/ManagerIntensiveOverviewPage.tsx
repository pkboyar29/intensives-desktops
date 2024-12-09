import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '../redux/store';
import { useDeleteIntensiveMutation } from '../redux/api/intensiveApi';

import Title from '../components/Title';
import Chip from '../components/Chip';
import PrimaryButton from '../components/PrimaryButton';
import Skeleton from 'react-loading-skeleton';
import TrashIcon from '../components/icons/TrashIcon';

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
    <div className="flex justify-center max-w-[1280px]">
      <div className="max-w-[765px] w-full">
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
              currentIntensive.openDate.toLocaleDateString() +
              ' - ' +
              currentIntensive.closeDate.toLocaleDateString()
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
                  {currentIntensive.teachers.map((teacherOnIntensive) => (
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
                children="Редактировать"
                clickHandler={() => {
                  navigate(`/manager/${currentIntensive?.id}/editIntensive`);
                }}
              />

              <div>
                <PrimaryButton
                  buttonColor="gray"
                  children={<TrashIcon />}
                  onClick={deleteIntensivButtonHandler}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerIntensiveOverviewPage;
