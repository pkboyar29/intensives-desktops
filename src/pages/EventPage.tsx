import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/store';
import { isUserStudent, isUserManager } from '../helpers/userHelpers';

import { useGetEventQuery } from '../redux/api/eventApi';
import { useDeleteEventMutation } from '../redux/api/eventApi';
import { useLazyGetEventAnswersQuery } from '../redux/api/eventAnswerApi';

import Modal from '../components/common/modals/Modal';
import PrimaryButton from '../components/common/PrimaryButton';
import TrashIcon from '../components/icons/TrashIcon';
import BackArrowIcon from '../components/icons/BackArrowIcon';
import Title from '../components/common/Title';
import Skeleton from 'react-loading-skeleton';
import Chip from '../components/common/Chip';
import { ToastContainer, toast } from 'react-toastify';

import { getTimeFromDate } from '../helpers/dateHelpers';
import EventAnswer from '../components/EventAnswer';
import EventAnswerList from '../components/EventAnswerList';

const EventPage: FC = () => {
  const currentUser = useAppSelector((state) => state.user.data);
  const [deleteEvent, { isSuccess }] = useDeleteEventMutation();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [isCreatingAnswer, setIsCreatingAnswer] = useState<boolean>(false);

  const [
    getEventAnswers,
    { data: eventAnswers, isLoading: isLoadingEventAnswers, error },
  ] = useLazyGetEventAnswersQuery();

  const navigate = useNavigate();
  const params = useParams();

  const {
    data: event,
    isLoading,
    isError,
  } = useGetEventQuery(Number(params.eventId), {
    refetchOnMountOrArgChange: true,
  });

  const [scoreTypeString, setScoreTypeString] = useState<
    | 'Без оценивания'
    | 'Оценивание по шкале'
    | 'Оценивание по шкале с критериями'
  >('Без оценивания');

  useEffect(() => {
    if (event && event.markStrategy) {
      if (event.criterias.length > 0) {
        setScoreTypeString('Оценивание по шкале с критериями');
      } else {
        setScoreTypeString('Оценивание по шкале');
      }
    } else {
      setScoreTypeString('Без оценивания');
    }

    // Загружаем ответы (студентов команды) на мероприятие
    if (
      event &&
      currentUser?.currentRole &&
      isUserStudent(currentUser.currentRole)
    ) {
      getEventAnswers(event.id);
    }
  }, [event, currentUser]);

  useEffect(() => {
    // Проверяем есть ли неоцененные ответы
    if (
      eventAnswers &&
      currentUser?.currentRole &&
      isUserStudent(currentUser.currentRole)
    ) {
      for (const answer in eventAnswers) {
        // Если есть неоцененный ответ скрываем кнопку отправить новый ответ
        if (eventAnswers[answer].hasMarks == false) {
          setIsCreatingAnswer(false);
          break;
        }
        // Если не нашлось неоцененного значит можно отправить ответ
        setIsCreatingAnswer(true);
      }
    }
  }, [eventAnswers, currentUser]);

  return (
    <>
      <ToastContainer position="top-center" />

      {deleteModal && (
        <Modal
          title="Удаление мероприятия"
          onCloseModal={() => setDeleteModal(false)}
        >
          <p className="text-lg text-bright_gray">
            {`Вы уверены, что хотите удалить мероприятие ${event?.name}?`}
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
                  const { error: responseError } = await deleteEvent(
                    Number(params.eventId)
                  );
                  setDeleteModal(false);

                  if (responseError) {
                    toast('Произошла серверная ошибка', { type: 'error' });
                  } else {
                    navigate(`/manager/${params.intensiveId}/schedule`);
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
          {isLoading ? (
            <Skeleton />
          ) : isError ? (
            <div className="flex flex-col items-center gap-5 mt-20">
              <div className="text-2xl font-bold">
                Мероприятия с данным id не существует
              </div>
              <div className="w-fit">
                <PrimaryButton
                  buttonColor="gray"
                  children={
                    <div className="flex items-center gap-2">
                      <BackArrowIcon />
                      <p>Вернуться к расписанию</p>
                    </div>
                  }
                  onClick={() => {
                    navigate(`/manager/${params.intensiveId}/schedule`);
                  }}
                />
              </div>
            </div>
          ) : (
            event && (
              <>
                <Title text={event.name} />

                <div className="flex flex-col gap-4 mt-3">
                  <div className="flex gap-2 text-base font-bold">
                    <div>{`${getTimeFromDate(
                      event.startDate
                    )} - ${getTimeFromDate(event.finishDate)}`}</div>
                    <div>{`${event.startDate.toLocaleDateString()}`}</div>
                  </div>

                  <p className="text-lg text-black_2">{event.description}</p>

                  <div className="flex flex-col gap-3 text-lg">
                    <div className="font-bold text-black_2">
                      Место проведения
                    </div>
                    <div>{event.audience.name}</div>
                  </div>

                  {event.teams.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <div className="text-lg font-bold text-black_2">
                        Участвующие команды
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {event.teams.map((team) => (
                          <Chip key={team.id} label={team.name} />
                        ))}
                      </div>
                    </div>
                  )}

                  {event.teachers.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <div className="text-lg font-bold text-black_2">
                        Преподаватели, проводящие мероприятие
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {event.teachers.map((teacher) => (
                          <Chip
                            key={teacher.id}
                            size="small"
                            label={teacher.name}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 text-lg">
                    <div className="font-bold text-black_2">Тип оценивания</div>
                    <div>{scoreTypeString}</div>
                  </div>

                  {(scoreTypeString == 'Оценивание по шкале с критериями' ||
                    scoreTypeString == 'Оценивание по шкале') &&
                    event.markStrategy && (
                      <div className="flex flex-col gap-3 text-lg">
                        <div className="font-bold text-black_2">
                          Шкала оценивания
                        </div>
                        <div>{event.markStrategy.name}</div>
                      </div>
                    )}

                  {scoreTypeString == 'Оценивание по шкале с критериями' &&
                    event.criterias &&
                    event.criterias.length > 0 && (
                      <div className="flex flex-col gap-3 text-lg">
                        <div className="font-bold text-black_2">Критерии</div>
                        <div className="flex flex-wrap gap-3">
                          {event.criterias.map((criteria) => (
                            <Chip key={criteria.id} label={criteria.name} />
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                {/* TODO: кнопку "назад" отображать для всех */}
                {currentUser?.currentRole &&
                  isUserManager(currentUser.currentRole) && (
                    <div className="flex items-center mt-10 text-lg font-bold gap-7">
                      <div>
                        <PrimaryButton
                          buttonColor="gray"
                          children={
                            <div className="flex items-center gap-2">
                              <BackArrowIcon />
                              <p>Назад</p>
                            </div>
                          }
                          onClick={() => {
                            navigate(`/manager/${params.intensiveId}/schedule`);
                          }}
                        />
                      </div>

                      <PrimaryButton
                        children="Редактировать"
                        clickHandler={() => {
                          navigate(
                            `/manager/${params.intensiveId}/schedule/editEvent?eventId=${event.id}`
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
                {currentUser?.currentRole &&
                isUserStudent(currentUser.currentRole) &&
                eventAnswers ? (
                  <>
                    <p className="mb-3 text-xl font-bold text-black_2">
                      {eventAnswers.length > 0
                        ? 'Ответы на мероприятие'
                        : 'Ответ на мероприятие не отправлен'}
                    </p>
                    {eventAnswers.length > 1 ? (
                      <EventAnswerList
                        eventAnswersShort={eventAnswers}
                        clickEventAnswer={(id: number) => console.log(id)}
                      />
                    ) : (
                      <EventAnswer
                        eventAnswerId={
                          eventAnswers[0] ? eventAnswers[0].id : undefined
                        }
                      />
                    )}
                  </>
                ) : (
                  <></>
                )}
              </>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default EventPage;
