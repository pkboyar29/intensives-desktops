import { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../redux/store';
import { useDeleteStageMutation } from '../redux/api/stageApi';
import { useUpdateVisibilityMutation } from '../redux/api/eventApi';
import { ISchedule, useGetScheduleQuery } from '../redux/api/scheduleApi';
import { isUserManager } from '../helpers/userHelpers';

import { Helmet } from 'react-helmet-async';
import PrimaryButton from '../components/common/PrimaryButton';
import Modal from '../components/common/modals/Modal';
import Title from '../components/common/Title';
import DisplaySelect from '../components/common/DisplaySelect';
import Skeleton from 'react-loading-skeleton';
import { ToastContainer, toast } from 'react-toastify';
import StageInSchedule from '../components/schedule/StageInSchedule';
import EventInSchedule from '../components/schedule/EventInSchedule';
import StageModal from '../components/common/modals/StageModal';

import { IStage } from '../ts/interfaces/IStage';
import { IEventShort } from '../ts/interfaces/IEvent';

const SchedulePage: FC = () => {
  const { intensiveId } = useParams();
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.user.data);
  const currentIntensive = useAppSelector((state) => state.intensive.data);

  const [deleteStageAPI] = useDeleteStageMutation();
  const [updateVisibilityAPI] = useUpdateVisibilityMutation();

  const {
    data,
    isLoading: isScheduleLoading,
    refetch,
  } = useGetScheduleQuery(Number(intensiveId), {
    refetchOnMountOrArgChange: true,
  });

  const [schedule, setSchedule] = useState<ISchedule>();

  useEffect(() => {
    if (data) {
      setSchedule(data);
    }
  }, [data]);

  const [stageModal, setStageModal] = useState<{
    status: boolean;
    stage: IStage | null;
  }>({
    status: false,
    stage: null,
  });
  const [deleteStageModal, setDeleteStageModal] = useState<{
    status: boolean;
    stageId: number | null;
  }>({
    status: false,
    stageId: null,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const onEventClick = (eventId: number) => {
    navigate(`${eventId}`);
  };

  const onEventEyeIconClick = async (event: IEventShort) => {
    toggleEventVisibility(event);
  };

  const toggleEventVisibility = async (event: IEventShort) => {
    const { data: responseData, error: responseError } =
      await updateVisibilityAPI({
        visibility: !event.visibility,
        eventId: event.id,
      });

    if (responseError) {
      toast('Произошла серверная ошибка', {
        type: 'error',
      });
    }

    if (responseData && schedule) {
      setSchedule({
        stages: schedule.stages,
        events: schedule.events.map((scheduleEvent) => {
          if (scheduleEvent.id === event.id) {
            return {
              ...scheduleEvent,
              visibility: !scheduleEvent.visibility,
            };
          } else {
            return scheduleEvent;
          }
        }),
      });
    }
  };

  const deleteStage = async (stageId: number) => {
    try {
      const { error: responseError } = await deleteStageAPI(stageId);

      setDeleteStageModal({
        status: false,
        stageId: null,
      });

      if (responseError) {
        toast('Произошла серверная ошибка', { type: 'error' });
      } else {
        refetch();
        // TODO: раскоментить?
        // if (schedule) {
        //   setSchedule({
        //     eventsWithoutStage: schedule.eventsWithoutStage,
        //     stages: schedule.stages.map((stage) => {
        //       if (stage.id !== stageId) {
        //         return stage;
        //       }
        //     }),
        //   });
        // }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {currentIntensive && `${currentIntensive.name} | Расписание`}
        </title>
      </Helmet>

      <ToastContainer position="top-center" />

      {stageModal.status && (
        <StageModal
          stage={stageModal.stage}
          onClose={() =>
            setStageModal({
              stage: null,
              status: false,
            })
          }
          onCancel={() =>
            setStageModal({
              stage: null,
              status: false,
            })
          }
          onChangeStage={(newStage) => {
            refetch();

            setStageModal({
              stage: null,
              status: false,
            });
          }}
        />
      )}

      {deleteStageModal.status && (
        <Modal
          title="Удаление этапа"
          onCloseModal={() =>
            setDeleteStageModal({
              status: false,
              stageId: null,
            })
          }
        >
          <p className="text-lg text-bright_gray">
            Вы уверены, что хотите удалить этап? Этап и все мероприятия в нем
            будут удалены
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <div>
              <PrimaryButton
                buttonColor="gray"
                clickHandler={() =>
                  setDeleteStageModal({
                    status: false,
                    stageId: null,
                  })
                }
                children="Отменить"
              />
            </div>
            <div>
              <PrimaryButton
                clickHandler={() => {
                  if (deleteStageModal.stageId) {
                    deleteStage(deleteStageModal.stageId);
                  }
                }}
                children="Удалить"
              />
            </div>
          </div>
        </Modal>
      )}

      <div className="max-w-[1280px]">
        <div className="flex items-start justify-between">
          <Title text="Расписание интенсива" />
          {isUserManager(currentUser) && (
            <DisplaySelect
              isOpen={isDropdownOpen}
              onDropdownClick={() => setIsDropdownOpen((isOpen) => !isOpen)}
              dropdownText="Редактировать"
            >
              <div className="flex flex-col gap-2.5 text-base">
                <div
                  className="transition cursor-pointer hover:text-blue"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setStageModal({
                      status: true,
                      stage: null,
                    });
                  }}
                >
                  Добавить этап
                </div>
                <div
                  className="transition cursor-pointer hover:text-blue"
                  onClick={() => navigate('editEvent')}
                >
                  Добавить мероприятие
                </div>
              </div>
            </DisplaySelect>
          )}
        </div>

        {isScheduleLoading ? (
          <Skeleton className="mt-10" />
        ) : (
          <>
            <div className="flex flex-col gap-5 mt-10">
              {schedule?.stages.length === 0 ? (
                <p className="text-xl text-black">
                  Этапы еще не определены для этого интенсива
                </p>
              ) : (
                <>
                  {schedule?.stages.map((stage) => (
                    <StageInSchedule
                      key={stage.id}
                      stage={stage}
                      stageEvents={schedule.events.filter(
                        (event) => event.stageId === stage.id
                      )}
                      onEditClick={(stage) =>
                        setStageModal({
                          status: true,
                          stage,
                        })
                      }
                      onDeleteClick={(stageId) =>
                        setDeleteStageModal({
                          status: true,
                          stageId: stage.id,
                        })
                      }
                      onEventClick={onEventClick}
                      onEventEyeIconClick={onEventEyeIconClick}
                    />
                  ))}
                </>
              )}
            </div>

            {schedule &&
              schedule.events.filter((event) => event.stageId === null).length >
                0 && (
                <div className="mt-10">
                  <div className="text-2xl font-bold text-black_2">
                    Мероприятия без этапа
                  </div>

                  <div className="ml-2.5 mt-2.5 flex flex-col gap-5">
                    {schedule?.events
                      .filter((event) => event.stageId === null)
                      .map((eventWithoutStage) => (
                        <EventInSchedule
                          key={eventWithoutStage.id}
                          event={eventWithoutStage}
                          onEventClick={onEventClick}
                          onEyeIconClick={onEventEyeIconClick}
                        />
                      ))}
                  </div>
                </div>
              )}
          </>
        )}
      </div>
    </>
  );
};

export default SchedulePage;
