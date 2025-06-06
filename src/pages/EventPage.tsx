import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/store';
import {
  isUserStudent,
  isUserManager,
  isUserTeamlead,
  isUserMentor,
  isUserTutor,
  isUserJury,
} from '../helpers/userHelpers';
import {
  getDateTimeDisplay,
  getEventDateDisplayString,
} from '../helpers/dateHelpers';
import { motion } from 'framer-motion';

import { useGetEventQuery } from '../redux/api/eventApi';
import { useDeleteEventMutation } from '../redux/api/eventApi';
import { useLazyGetEventAnswersQuery } from '../redux/api/eventAnswerApi';

import { IEventAnswer } from '../ts/interfaces/IEventAnswer';

import { Helmet } from 'react-helmet-async';
import Modal from '../components/common/modals/Modal';
import BackToScheduleButton from '../components/BackToScheduleButton';
import PrimaryButton from '../components/common/PrimaryButton';
import TrashIcon from '../components/icons/TrashIcon';
import BackArrowIcon from '../components/icons/BackArrowIcon';
import Title from '../components/common/Title';
import Skeleton from 'react-loading-skeleton';
import ChipList from '../components/common/ChipList';
import { ToastContainer, toast } from 'react-toastify';
import EventAnswer from '../components/EventAnswer';
import EventAnswerList from '../components/EventAnswerList';
import Accordion from '../components/common/Accordion';
import AttachedFileList from '../components/AttachedFileList';

const EventPage: FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  const currentUser = useAppSelector((state) => state.user.data);
  const currentTeam = useAppSelector((state) => state.team.data);
  const currentIntensive = useAppSelector((state) => state.intensive.data);

  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const [eventAnswers, setEventAnswers] = useState<IEventAnswer[]>([]);
  const [isCreatingAnswer, setIsCreatingAnswer] = useState<boolean>(true);
  const [expandedAnswer, setExpandedAnswer] = useState<number | null>(null);
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);

  const {
    data: event,
    isLoading,
    isError,
  } = useGetEventQuery(Number(params.eventId), {
    refetchOnMountOrArgChange: true,
  });
  const [deleteEvent, { isSuccess }] = useDeleteEventMutation();

  const [
    getEventAnswers,
    { data: eventAnswersData, isLoading: isLoadingEventAnswers, error },
  ] = useLazyGetEventAnswersQuery();

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
  }, [event, currentUser]);

  useEffect(() => {
    // Загружаем ответы на мероприятие (для студентов/тимлида/наставника/тьютора - ответы их команды, для препода жюри и организатора - ответы всех команд)
    if (event) {
      getEventAnswers(event.id);
    }
  }, [event]);

  useEffect(() => {
    if (eventAnswersData) {
      // Сохраняем ответы в состояние
      setEventAnswers(eventAnswersData);

      // Проверяем есть ли неоцененные ответы
      for (const answer in eventAnswersData) {
        // Если есть неоцененный ответ (undefined или 0 ответов) скрываем кнопку отправить новый ответ
        if (
          !eventAnswersData[answer].marks ||
          eventAnswersData[answer].marks.length == 0
        ) {
          setIsCreatingAnswer(false);
          break;
        }
      }
    }
  }, [eventAnswersData]);

  const renderEventAnswers = (eventAnswers: IEventAnswer[]) => {
    return (
      <>
        {eventAnswers.length > 0 && (
          <>
            <EventAnswerList
              eventAnswers={eventAnswers}
              expandedAnswer={expandedAnswer}
              clickEventAnswer={(id: number) =>
                setExpandedAnswer((prev) => (prev === id ? null : id))
              }
            />

            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={
                expandedAnswer ? { opacity: 1, height: 'auto', scale: 1 } : {}
              }
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              {expandedAnswer && event && (
                <EventAnswer
                  event={event}
                  eventAnswerData={eventAnswers.find(
                    (answer) => answer.id === expandedAnswer
                  )}
                  onUpdateAnswer={(newAnswer: IEventAnswer) => {
                    setEventAnswers((prev) =>
                      prev.map((answer) => {
                        if (answer.id === newAnswer.id) {
                          return newAnswer;
                        } else {
                          return answer;
                        }
                      })
                    );
                  }}
                  onDeleteAnswer={(id: number) => {
                    setEventAnswers((prev) =>
                      prev?.filter((answer) => answer.id !== id)
                    );

                    setExpandedAnswer(null);
                    setIsCreatingAnswer(true); // еще лучше проверить что ответов без оценки действительно больше нет
                  }}
                />
              )}
            </motion.div>
          </>
        )}
      </>
    );
  };

  const renderTeamAnswers = (expandedTeam: number) => {
    const teamAnswers = eventAnswers.filter(
      (eventAnswer) => expandedTeam === eventAnswer.team.id
    );

    if (teamAnswers.length === 0) {
      return (
        <div className="p-1.5 sm:p-4 text-base sm:text-lg">
          Команда не прислала ответа
        </div>
      );
    } else {
      return renderEventAnswers(teamAnswers);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {currentIntensive &&
            event &&
            `${event.name} | ${currentIntensive.name}`}
        </title>
      </Helmet>

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
                    navigate(`/intensives/${params.intensiveId}/schedule`);
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
                    navigate(`/intensives/${params.intensiveId}/schedule`);
                  }}
                />
              </div>
            </div>
          ) : (
            event && (
              <>
                <Title text={event.name} />

                <div className="flex flex-col gap-2.5 mt-3 md:gap-4">
                  <div className="text-base font-bold">
                    {getEventDateDisplayString(
                      event.startDate,
                      event.finishDate
                    )}
                  </div>

                  {event.description && (
                    <p className="text-lg text-black_2">{event.description}</p>
                  )}

                  <div className="flex flex-col gap-3 text-lg">
                    <div className="font-bold text-black_2">
                      Место проведения
                    </div>

                    <div>
                      {event.isOnline ? 'Онлайн' : event.audience?.name}
                    </div>
                  </div>

                  {event.teams.length > 0 && (
                    <div className="flex flex-col gap-3 text-lg">
                      <div className="font-bold text-black_2">
                        Участвующие команды
                      </div>
                      <ChipList items={event.teams} chipSize="small" />
                    </div>
                  )}

                  {event.teachers.length > 0 && (
                    <div className="flex flex-col gap-3 text-lg">
                      <div className="font-bold text-black_2">
                        Преподаватели, проводящие мероприятие
                      </div>
                      <ChipList items={event.teachers} chipSize="small" />
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
                        <ChipList items={event.criterias} chipSize="small" />
                      </div>
                    )}

                  {event.deadlineDate && (
                    <div className="flex flex-col gap-3 text-lg">
                      <div className="font-bold text-black_2">
                        Дедлайн ответа
                      </div>
                      <div
                        className={`${
                          new Date() > event.deadlineDate && 'text-dark_red'
                        }`}
                      >
                        {getDateTimeDisplay(event.deadlineDate)}
                      </div>
                    </div>
                  )}

                  {event?.files && (
                    <div>
                      <AttachedFileList
                        context={'events'}
                        nameFileList={'мероприятия'}
                        contextId={event.id}
                        files={event?.files}
                      />
                    </div>
                  )}
                </div>

                {/* отображение секции с ответами только если у нас тип мероприятия - с оцениванием */}
                {event.markStrategy && (
                  <>
                    {/* отображение аккордеона для преподавателей жюри/организаторов */}
                    {(isUserManager(currentUser) ||
                      isUserJury(currentUser, event)) && (
                      <div className="flex flex-col gap-3 mt-10">
                        <p className="text-xl font-bold text-black_2">
                          {isUserManager(currentUser)
                            ? 'Ответы команд'
                            : 'Оцениваемые команды'}
                        </p>

                        <Accordion
                          items={event.teams}
                          expandedItemId={expandedTeam}
                          onItemClick={(item) => setExpandedTeam(item)}
                          expandedContent={
                            expandedTeam
                              ? renderTeamAnswers(expandedTeam)
                              : null
                          }
                        />
                      </div>
                    )}

                    {/* отображение ответов текущей команды для студентов/наставника/тьютора команды */}
                    {(isUserStudent(currentUser) ||
                      (isUserTutor(currentUser, currentTeam) &&
                        !isUserJury(currentUser, event)) ||
                      isUserMentor(currentUser)) && (
                      <div className="flex flex-col gap-3 mt-5 md:mt-10">
                        <p className="text-lg font-bold md:text-xl text-black_2">
                          {eventAnswers.length > 0
                            ? 'Ответы на мероприятие моей команды'
                            : 'Ответ на мероприятие не отправлен'}
                        </p>

                        {/* если есть currentTeam, то eventAnswers отображается фильтрованный для этой команды */}
                        {currentTeam && !isUserStudent(currentUser)
                          ? renderEventAnswers(
                              eventAnswers.filter(
                                (answer) => answer.team.id === currentTeam.id
                              )
                            )
                          : renderEventAnswers(eventAnswers)}

                        {/* отображение только для тимлида */}
                        {isUserTeamlead(currentUser, currentTeam) &&
                          isCreatingAnswer &&
                          !expandedAnswer &&
                          event && (
                            <EventAnswer
                              event={event}
                              onCreateAnswer={(newAnswer: IEventAnswer) => {
                                setEventAnswers((prevAnswers) => [
                                  ...prevAnswers,
                                  newAnswer,
                                ]);

                                setIsCreatingAnswer(false);
                                setExpandedAnswer(newAnswer.id);
                              }}
                            />
                          )}
                        {!isUserTeamlead(currentUser, currentTeam) && (
                          <p className="text-lg md:text-xl text-black_2">
                            Отправка ответа доступна тимлиду команды
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}

                {isUserManager(currentUser) && (
                  <div className="flex items-center gap-3 mt-5 text-lg font-bold md:mt-10 md:gap-7">
                    <BackToScheduleButton />

                    <PrimaryButton
                      children="Редактировать"
                      clickHandler={() => {
                        navigate(
                          `/intensives/${params.intensiveId}/schedule/editEvent?eventId=${event.id}`
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
              </>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default EventPage;
