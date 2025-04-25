import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/store';
import { isUserManager } from '../helpers/userHelpers';

import { useDeleteIntensiveMutation } from '../redux/api/intensiveApi';

import Title from '../components/common/Title';
import ChipList from '../components/common/ChipList';
import PrimaryButton from '../components/common/PrimaryButton';
import Skeleton from 'react-loading-skeleton';
import TrashIcon from '../components/icons/TrashIcon';
import Modal from '../components/common/modals/Modal';
import { ToastContainer, toast } from 'react-toastify';
import AttachedFileList from '../components/AttachedFileList';

const IntensiveOverviewPage: FC = () => {
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
            Вы уверены, что хотите удалить интенсив{' '}
            <span className="font-bold text-black">
              {currentIntensive.name}
            </span>
            ?
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
                    toast('Произошла серверная ошибка при удалении интенсива', {
                      type: 'error',
                    });
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
                  <div className="text-lg break-words line-clamp-6">
                    {currentIntensive.description}
                  </div>
                ) : (
                  <Skeleton />
                )}
              </div>
            )}

            <div className="my-3 text-lg font-bold text-black_2">Участники</div>

            <div className="flex flex-col gap-3 text-lg">
              {currentIntensive ? (
                <ChipList
                  title="Список учебных потоков"
                  items={currentIntensive.flows}
                  chipSize="big"
                />
              ) : (
                <Skeleton />
              )}

              {currentIntensive ? (
                currentIntensive.specificStudents.length > 0 && (
                  <ChipList
                    title="Список отдельных студентов"
                    items={currentIntensive.specificStudents.map((s) => ({
                      id: s.id,
                      name: s.nameWithGroup,
                    }))}
                    chipSize="small"
                  />
                )
              ) : (
                <Skeleton />
              )}

              {currentIntensive ? (
                <ChipList
                  title="Список преподавателей"
                  items={currentIntensive.teachers}
                  chipSize="small"
                />
              ) : (
                <Skeleton />
              )}

              {currentIntensive ? (
                currentIntensive.roles.length > 0 && (
                  <ChipList
                    title="Список ролей для студентов"
                    items={currentIntensive.roles}
                    chipSize="small"
                  />
                )
              ) : (
                <Skeleton />
              )}

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

              {isUserManager(currentUser) && (
                <div className="flex items-center gap-3 mt-5 text-lg font-bold md:mt-10 md:gap-7">
                  <PrimaryButton
                    children="Редактировать"
                    clickHandler={() => {
                      navigate(
                        `/intensives/${currentIntensive?.id}/editIntensive`
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

export default IntensiveOverviewPage;
