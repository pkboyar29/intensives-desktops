import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '../redux/store';
import { useDeleteIntensiveMutation } from '../redux/api/intensiveApi';

import Title from '../components/common/Title';
import Chip from '../components/common/Chip';
import PrimaryButton from '../components/common/PrimaryButton';
import Skeleton from 'react-loading-skeleton';
import TrashIcon from '../components/icons/TrashIcon';
import Modal from '../components/common/modals/Modal';
import { ToastContainer, toast } from 'react-toastify';
import AttachedFileList from '../components/AttachedFileList';

const ManagerIntensiveOverviewPage: FC = () => {
  const navigate = useNavigate();

  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const currentIntensive = useAppSelector((state) => state.intensive.data);
  const currentUser = useAppSelector((state) => state.user.data);

  const [deleteIntensive] = useDeleteIntensiveMutation();

  return (
    <>
      <ToastContainer position="top-center" />

      {deleteModal && currentIntensive && (
        <Modal
          title="Удаление интенсива"
          onCloseModal={() => setDeleteModal(false)}
        >
          <p className="text-lg text-bright_gray">
            {`Вы уверены, что хотите удалить интенсив ${currentIntensive.name}?`}
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <div>
              <PrimaryButton
                buttonColor="gray"
                clickHandler={() => setDeleteModal(false)}
                children="Отмена"
              />
            </div>
            <div>
              <PrimaryButton
                clickHandler={async () => {
                  const { error: responseError } = await deleteIntensive(
                    currentIntensive.id
                  );
                  setDeleteModal(false);

                  if (responseError) {
                    toast('Произошла серверная ошибка', { type: 'error' });
                  } else {
                    navigate(`/intensives`);
                  }
                }}
                children="Удалить"
              />
            </div>
          </div>
        </Modal>
      )}

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
            <div className="my-3 text-lg font-bold">
              {currentIntensive ? (
                currentIntensive.openDate.toLocaleDateString() +
                ' - ' +
                currentIntensive.closeDate.toLocaleDateString()
              ) : (
                <Skeleton />
              )}
            </div>

            {currentIntensive?.description && (
              <div className="my-3">
                {currentIntensive ? (
                  <div className="text-lg">{currentIntensive.description}</div>
                ) : (
                  <Skeleton />
                )}
              </div>
            )}

            <div className="my-3 text-lg font-bold text-black_2">Участники</div>

            <div className="flex flex-col gap-3 text-lg">
              <div className="flex flex-col gap-3">
                <div>Список учебных потоков</div>
                {currentIntensive ? (
                  <div className="flex flex-wrap gap-3">
                    {currentIntensive.flows.map((flow) => (
                      <Chip key={flow.id} label={flow.name} size="big" />
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

              <div className="flex flex-col gap-3">
                {currentIntensive ? (
                  <>
                    {currentIntensive.roles.length > 0 && (
                      <>
                        <div>Список ролей для студентов</div>
                        <div className="flex flex-wrap gap-3">
                          {currentIntensive.roles.map((role) => (
                            <Chip key={role.id} label={role.name} />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <Skeleton />
                )}
              </div>

              {currentIntensive?.files && (
                <div>
                  <AttachedFileList
                    context={'intensives'}
                    contextId={currentIntensive.id}
                    files={currentIntensive?.files}
                    onFileClick={(id: number) =>
                      console.log('clicked file id ' + id)
                    }
                  />
                </div>
              )}

              {currentUser?.roles.includes('Организатор') && (
                <div className="flex items-center mt-10 text-lg font-bold gap-7">
                  <PrimaryButton
                    children="Редактировать"
                    clickHandler={() => {
                      navigate(
                        `/manager/${currentIntensive?.id}/editIntensive`
                      );
                    }}
                  />

                  <div>
                    <PrimaryButton
                      buttonColor="gray"
                      children={<TrashIcon />}
                      onClick={() => {
                        setDeleteModal(true);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagerIntensiveOverviewPage;
