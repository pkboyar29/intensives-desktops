import { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetEventsOnIntensiveQuery } from '../redux/api/eventApi';
import {
  useLazyGetStagesForIntensiveQuery,
  useDeleteStageMutation,
} from '../redux/api/stageApi';

import { IManagerEvent } from '../ts/interfaces/IEvent';

import PrimaryButton from '../components/PrimaryButton';
import Modal from '../components/modals/Modal';
import Title from '../components/Title';
import DisplaySelect from '../components/DisplaySelect';
import EditIcon from '../components/icons/EditIcon';
import TrashIcon from '../components/icons/TrashIcon';

import StageModal from '../components/modals/StageModal';

import { IStage } from '../ts/interfaces/IStage';

import { replaceLastURLSegment } from '../helpers/urlHelpers';

const SchedulePage: FC = () => {
  const { intensiveId } = useParams();
  const navigate = useNavigate();

  const [deleteStage] = useDeleteStageMutation();

  const [getStagesForIntensive] = useLazyGetStagesForIntensiveQuery();
  const [stages, setStages] = useState<IStage[]>([]);

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

  const { data: events } = useGetEventsOnIntensiveQuery(Number(intensiveId), {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    const fetchStages = async () => {
      if (intensiveId) {
        try {
          const { data } = await getStagesForIntensive(Number(intensiveId));

          if (data) {
            setStages(data);
          }
        } catch (e) {
          console.log(e);
        }
      }
    };

    fetchStages();
  }, []);

  interface EventProps {
    event: IManagerEvent;
  }

  const Event: FC<EventProps> = ({ event }) => {
    const eventClickHandler = (eventId: number) => {
      navigate(`${replaceLastURLSegment('editEvent')}?eventId=${eventId}`);
    };

    return (
      <>
        <section className="flex flex-col justify-center items-start px-4 py-4 w-full leading-[150%] max-md:max-w-full">
          <div
            key={event.name}
            className="flex p-4"
            onClick={() => {
              eventClickHandler(event.id);
            }}
          >
            <div className="flex flex-col justify-center">
              <p className="text-xl">{event.name}</p>
              <time className="text-base text-bright_gray">
                {event.dateStart + ' ' + event.dateEnd}
              </time>
            </div>
          </div>
        </section>
      </>
    );
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
          onChangeStage={(newStage) => {
            if (!stageModal.stage) {
              setStages([...stages, newStage]);
            } else {
              setStages((stages) =>
                stages.map((stage) => {
                  if (stage.id === newStage.id) {
                    return {
                      ...newStage,
                    };
                  } else {
                    return stage;
                  }
                })
              );
            }

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
                text="Отменить"
              />
            </div>
            <div>
              <PrimaryButton
                clickHandler={async () => {
                  try {
                    if (deleteStageModal.stageId) {
                      await deleteStage(deleteStageModal.stageId);

                      setStages((stages) =>
                        stages.filter(
                          (stage) => stage.id !== deleteStageModal.stageId
                        )
                      );
                    }

                    setDeleteStageModal({
                      status: false,
                      stageId: null,
                    });
                  } catch (e) {
                    console.log(e);
                  }
                }}
                text="Удалить"
              />
            </div>
          </div>
        </Modal>
      )}

      <div className="min-h-screen min-w-[50vw] max-w-[1280px]">
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
                onClick={() => navigate(replaceLastURLSegment('editEvent'))}
              >
                Добавить мероприятие
              </div>
            </div>
          </DisplaySelect>
        </div>

        {/* TODO: компонент Stage, внутри которого компоненты Event? */}
        <div className="flex flex-col gap-5 mt-10">
          {stages.map((stage) => (
            <div key={stage.id} className="flex justify-between">
              <div className="flex flex-col gap-3">
                <div className="text-xl font-bold text-black_2">
                  {stage.name}
                </div>
                <div className="text-bright_gray">
                  {stage.startDate.toLocaleDateString()} -{' '}
                  {stage.finishDate.toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  className="w-9 h-9 rounded-[10px] bg-another_white hover:bg-black_gray transition duration-300 ease-in-out flex justify-center items-center"
                  onClick={() => {
                    setStageModal({
                      status: true,
                      stage,
                    });
                  }}
                >
                  <EditIcon />
                </button>

                <button
                  className="w-9 h-9 rounded-[10px] bg-another_white hover:bg-black_gray transition duration-300 ease-in-out flex justify-center items-center"
                  onClick={() => {
                    setDeleteStageModal({
                      status: true,
                      stageId: stage.id,
                    });
                  }}
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>

        {events?.map((event) => (
          <Event key={event.id} event={event} />
        ))}
      </div>
    </>
  );
};

export default SchedulePage;
