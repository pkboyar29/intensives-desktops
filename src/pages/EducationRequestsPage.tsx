import { FC, useState, useEffect } from 'react';
import { useAppSelector } from '../redux/store';
import {
  useLazyGetEducationRequestsQuery,
  useDeleteEducationRequestMutation,
  useChangeEducationRequestStatusMutation,
} from '../redux/api/educationRequestApi';
import {
  isUserManager,
  isUserTeacher,
  isUserTeamlead,
} from '../helpers/userHelpers';

import SearchBar from '../components/common/SearchBar';
import Filter from '../components/common/Filter';
import Title from '../components/common/Title';
import PrimaryButton from '../components/common/PrimaryButton';
import Modal from '../components/common/modals/Modal';
import EducationRequestModal from '../components/common/modals/EducationRequestModal';
import EducationRequestAnswerModal from '../components/common/modals/EducationRequestAnswerModal';
import EducationRequestCard from '../components/EducationRequestCard';
import Skeleton from 'react-loading-skeleton';
import { ToastContainer, toast } from 'react-toastify';

import {
  IEducationRequest,
  defaultEducationRequest,
} from '../ts/interfaces/IEducationRequest';

const EducationRequestsPage: FC = () => {
  const currentUser = useAppSelector((state) => state.user.data);
  const currentTeam = useAppSelector((state) => state.team.data);
  const currentIntensive = useAppSelector((state) => state.intensive.data);

  const [educationRequests, setEducationRequests] = useState<
    IEducationRequest[]
  >([]);

  const [filteredRequests, setFilteredRequests] = useState<IEducationRequest[]>(
    []
  );

  const [searchText, setSearchText] = useState<string>('');
  const [openness, setOpenness] = useState<'closed' | 'opened' | 'all'>('all');

  const [requestModal, setRequestModal] = useState<{
    status: boolean;
    request: IEducationRequest | null;
  }>({
    status: false,
    request: null,
  });
  const [deleteModal, setDeleteModal] = useState<{
    status: boolean;
    request: IEducationRequest | null;
  }>({
    status: false,
    request: null,
  });
  const [answerModal, setAnswerModal] = useState<{
    status: boolean;
    request: IEducationRequest;
  }>({ status: false, request: defaultEducationRequest });

  const [getEducationRequests, { isLoading }] =
    useLazyGetEducationRequestsQuery();
  const [deleteEducationRequest] = useDeleteEducationRequestMutation();
  const [changeStatus] = useChangeEducationRequestStatusMutation();

  const searchInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const updateFilteredRequests = () => {
    if (educationRequests) {
      let filteredRequests: IEducationRequest[] = [];

      filteredRequests = educationRequests.filter(
        (request) =>
          request.subject.toLowerCase().includes(searchText.toLowerCase()) ||
          request.description?.toLowerCase().includes(searchText.toLowerCase())
      );

      if (isUserManager(currentUser)) {
        if (openness === 'opened') {
          filteredRequests = filteredRequests.filter(
            (request) => request.status === 'Открыт'
          );
        }
        if (openness === 'closed') {
          filteredRequests = filteredRequests.filter(
            (request) => request.status === 'Решен'
          );
        }
      }

      setFilteredRequests(filteredRequests);
    }
  };

  // TODO: за студента происходит два запроса при обновлении страницы (из-за того что currentTeam не подгружена)
  const fetchRequests = async () => {
    if (!currentIntensive) {
      return;
    }

    if (isUserTeacher(currentUser) && !currentTeam) {
      return;
    }

    try {
      const { data } = await getEducationRequests({
        intensiveId: currentIntensive.id,
        teamId:
          isUserTeacher(currentUser) && currentTeam ? currentTeam.id : null,
      });

      if (data) {
        setEducationRequests(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    updateFilteredRequests();
  }, [searchText, educationRequests, openness]);

  useEffect(() => {
    fetchRequests();
  }, [currentIntensive, currentTeam]);

  const onChangeStatusButtonClick = async (
    educationRequest: IEducationRequest
  ) => {
    const { error } = await changeStatus({
      status: educationRequest.status === 'Открыт' ? 'CLOSED' : 'OPENED',
      requestId: educationRequest.id,
    });

    if (error) {
      toast(
        'Произошла серверная ошибка при изменении статуса образовательного запроса',
        {
          type: 'error',
        }
      );
    } else {
      setEducationRequests(
        educationRequests.map((request) => {
          if (request.id === educationRequest.id) {
            return {
              ...request,
              status: request.status === 'Открыт' ? 'Решен' : 'Открыт',
            };
          } else {
            return request;
          }
        })
      );
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />

      {requestModal.status && (
        <EducationRequestModal
          request={requestModal.request}
          onClose={() =>
            setRequestModal({
              request: null,
              status: false,
            })
          }
          onCancel={() =>
            setRequestModal({
              request: null,
              status: false,
            })
          }
          onChangeRequest={(changedRequest) => {
            if (
              educationRequests.find(
                (request) => request.id === changedRequest.id
              )
            ) {
              // если запрос изменили
              setEducationRequests(
                educationRequests.map((request) => {
                  if (request.id === changedRequest.id) {
                    return changedRequest;
                  } else {
                    return request;
                  }
                })
              );
            } else {
              // если новый запрос добавили
              setEducationRequests([changedRequest, ...educationRequests]);
            }

            setRequestModal({
              request: null,
              status: false,
            });
          }}
        />
      )}

      {deleteModal.status && (
        <Modal
          title="Удаление образовательного запроса"
          onCloseModal={() =>
            setDeleteModal({
              status: false,
              request: null,
            })
          }
        >
          <p className="text-lg text-bright_gray">
            Вы уверены, что хотите удалить этот образовательный запрос?
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <div>
              <PrimaryButton
                buttonColor="gray"
                clickHandler={() =>
                  setDeleteModal({
                    status: false,
                    request: null,
                  })
                }
                children="Отменить"
              />
            </div>
            <div>
              <PrimaryButton
                clickHandler={async () => {
                  if (deleteModal.request) {
                    const { error } = await deleteEducationRequest(
                      deleteModal.request.id
                    );

                    if (error) {
                      toast(
                        'Произошла серверная ошибка при удалении образовательного запроса',
                        {
                          type: 'error',
                        }
                      );
                    } else {
                      setEducationRequests(
                        educationRequests.filter(
                          (request) => request.id !== deleteModal.request!.id
                        )
                      );
                    }

                    setDeleteModal({
                      status: false,
                      request: null,
                    });
                  }
                }}
                children="Удалить"
              />
            </div>
          </div>
        </Modal>
      )}

      {answerModal.status && (
        <EducationRequestAnswerModal
          onClose={() =>
            setAnswerModal({ status: false, request: defaultEducationRequest })
          }
          onCancel={() =>
            setAnswerModal({ status: false, request: defaultEducationRequest })
          }
          onChangeRequest={(updatedRequest) => {
            setEducationRequests(
              educationRequests.map((request) => {
                if (request.id === updatedRequest.id) {
                  return updatedRequest;
                } else {
                  return request;
                }
              })
            );

            setAnswerModal({ status: false, request: defaultEducationRequest });
          }}
          request={answerModal.request}
        />
      )}

      <Title text="Образовательные запросы" />

      <div className="mt-4 sm:mt-8">
        {isUserTeamlead(currentUser, currentTeam) && (
          <div className="flex justify-end">
            <div className="ml-auto">
              <PrimaryButton
                disabled={educationRequests.length >= 10}
                className={`${
                  educationRequests.length >= 10 && 'cursor-not-allowed'
                }`}
                children="Отправить образовательный запрос"
                clickHandler={() =>
                  setRequestModal({
                    status: true,
                    request: null,
                  })
                }
              />
            </div>
          </div>
        )}
      </div>

      <SearchBar
        searchText={searchText}
        searchInputChangeHandler={searchInputChangeHandler}
      />

      <div className="mt-4">
        {isUserManager(currentUser) && (
          <Filter
            onFilterOptionClick={(filterOption) =>
              setOpenness(filterOption as 'all' | 'opened' | 'closed')
            }
            activeFilterOption={openness}
            filterList={[
              { label: 'Открытые', value: 'opened' },
              { label: 'Решенные', value: 'closed' },
              { label: 'Все', value: 'all' },
            ]}
          />
        )}
      </div>

      <div className="mt-4 md:mt-6">
        {isLoading ? (
          <Skeleton />
        ) : educationRequests.length === 0 ? (
          <div className="text-xl text-black">
            {isUserManager(currentUser)
              ? 'На данный момент образовательных запросов нету'
              : 'Команда еще не отправила ни одного образовательного запроса'}
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredRequests?.map((request) => (
              <EducationRequestCard
                key={request.id}
                educationRequest={request}
                onEditButtonClick={(requestToEdit) => {
                  setRequestModal({ status: true, request: requestToEdit });
                }}
                onDeleteButtonClick={(requestToDelete) => {
                  setDeleteModal({ status: true, request: requestToDelete });
                }}
                onChangeStatusButtonClick={onChangeStatusButtonClick}
                onAnswerButtonClick={(requestToWatchAnswer) => {
                  setAnswerModal({
                    status: true,
                    request: requestToWatchAnswer,
                  });
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-xl text-black">Ничего не найдено</div>
        )}
      </div>
    </>
  );
};

export default EducationRequestsPage;
