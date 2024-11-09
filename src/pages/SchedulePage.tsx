import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useDeleteStageMutation } from '../redux/api/stageApi';

import { useGetScheduleQuery } from '../redux/api/scheduleApi';

import PrimaryButton from '../components/PrimaryButton';
import Modal from '../components/modals/Modal';
import Title from '../components/Title';
import DisplaySelect from '../components/DisplaySelect';
import Skeleton from 'react-loading-skeleton';

import StageInSchedule from '../components/schedule/StageInSchedule';
import EventInSchedule from '../components/schedule/EventInSchedule';
import StageModal from '../components/modals/StageModal';

import { IStage } from '../ts/interfaces/IStage';

const SchedulePage: FC = () => {
  const { intensiveId } = useParams();
  const navigate = useNavigate();

  const [deleteStage] = useDeleteStageMutation();

  const {
    data: schedule,
    isLoading: isScheduleLoading,
    refetch,
  } = useGetScheduleQuery(Number(intensiveId), {
    refetchOnMountOrArgChange: true,
  });

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

  return (
    <>
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
          onChangeStage={() => {
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
          title="Вы уверены, что хотите удалить этап?"
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
                clickHandler={async () => {
                  try {
                    if (deleteStageModal.stageId) {
                      await deleteStage(deleteStageModal.stageId);
                    }

                    refetch();

                    setDeleteStageModal({
                      status: false,
                      stageId: null,
                    });
                  } catch (e) {
                    console.log(e);
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
                    />
                  ))}
                </>
              )}
            </div>

            {schedule && schedule.eventsWithoutStage.length > 0 && (
              <div className="mt-10">
                <div className="text-2xl font-bold text-black_2">
                  Мероприятия без этапа
                </div>

                <div className="ml-2.5 mt-2.5 flex flex-col gap-5">
                  {schedule?.eventsWithoutStage.map((eventWithoutStage) => (
                    <EventInSchedule
                      key={eventWithoutStage.id}
                      event={eventWithoutStage}
                      onEventClick={onEventClick}
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
