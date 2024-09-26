import { FC, useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';

import { TeamsContext } from '../context/TeamsContext';
import { EventsContext } from '../context/EventsContext';
import { CurrentUserContext } from '../context/CurrentUserContext';
import authHeader from '../helpers/getHeaders';

import Title from '../components/Title';
import { ITeam } from '../ts/interfaces/ITeam';
import { IEvent } from '../ts/interfaces/IEvent';

type FormValues = {
  marks: { criteriaId: number; mark: number }[];
  comment: string;
};

const TeamEvaluationPage: FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { teams, getTeams } = useContext(TeamsContext);
  const { events, setEventsForIntensiv } = useContext(EventsContext);
  const { currentUser } = useContext(CurrentUserContext);
  const [currentAnswer, setCurrentAnswer] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { register, handleSubmit } = useForm<FormValues>({
    mode: 'onBlur',
    defaultValues: {
      marks: [],
      comment: '',
    },
  });

  const currentTeam: ITeam | undefined = teams.find((team: ITeam) => {
    if (params.teamId) {
      return team.id === parseInt(params.teamId, 10);
    }
  });

  const currentEvent: IEvent | undefined = events.find((event: IEvent) => {
    if (params.eventId) {
      return event.id === parseInt(params.eventId, 10);
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      if (params.intensiveId && params.eventId) {
        getTeams(parseInt(params.intensiveId, 10));
        setEventsForIntensiv(parseInt(params.intensiveId, 10));
      }
      await getCurrentAnswer();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const getCurrentAnswer = async () => {
    const answersResponse = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/answers/`,
      { headers: await authHeader() }
    );
    const allAnswers = answersResponse.data.results;
    const currentEventAnswers = allAnswers.filter((answer: any) => {
      if (params.eventId) {
        return answer.event === parseInt(params.eventId, 10);
      }
    });
    const currentTeamAnswer = currentEventAnswers.find(
      (answer: any) => String(answer.command) === String(params.teamId)
    );
    setCurrentAnswer(currentTeamAnswer);
  };

  const onSubmit = (data: FormValues) => {
    const marks = data.marks;

    marks.forEach(async (mark: any) => {
      try {
        let requestBody;
        if (mark.criteriaId === '0') {
          requestBody = {
            mark: mark.mark,
            comment: data.comment,
            answer: currentAnswer.id,
            teacher: currentUser?.teacher_id,
          };
        } else {
          requestBody = {
            mark: mark.mark,
            comment: data.comment,
            answer: currentAnswer.id,
            criteria: mark.criteriaId,
            teacher: currentUser?.teacher_id,
          };
        }
        console.log(requestBody);

        const markResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/marks/`,
          requestBody,
          { headers: await authHeader() }
        );
        console.log(markResponse.data);
      } catch (error) {
        console.log(error);
      }
    });
  };

  const renderMarkContent = (criteriaId: number, index: number) => {
    switch (currentEvent?.markStrategyId) {
      case 2:
        return (
          <>
            <input
              type="hidden"
              {...register(`marks.${index}.criteriaId`)}
              value={criteriaId}
            />
            <select
              {...register(`marks.${index}.mark`, { required: true })}
              className="border border-black border-solid rounded-xl"
            >
              <option value="">Выберите оценку</option>
              <option value={1}>Зачет</option>
              <option value={0}>Незачет</option>
            </select>
          </>
        );
      case 3:
        return (
          <>
            <input
              type="hidden"
              {...register(`marks.${index}.criteriaId`)}
              value={criteriaId}
            />
            <input
              className="text-sm border border-black border-solid"
              min={2}
              max={5}
              type="number"
              {...register(`marks.${index}.mark`, {
                required: true,
                min: 2,
                max: 5,
              })}
            />
          </>
        );
      default:
        return <div>Непонятно</div>;
    }
  };

  if (isLoading) {
    return <div className="mt-3 font-sans text-2xl font-bold">Загрузка...</div>;
  }

  return (
    <>
      <Title text={currentTeam?.name || ''} />

      <div className="my-5 font-sans text-xl font-bold text-black">
        Ответ команды
      </div>
      {currentAnswer ? (
        <div className="mt-5 text-base font-normal text-black font-inter">
          {currentAnswer.text}
        </div>
      ) : (
        <div className="mt-5 text-base font-normal text-black font-inter">
          Команда не прислала ответа
        </div>
      )}

      {currentAnswer && (
        <form onSubmit={handleSubmit(onSubmit)}>
          {currentEvent?.criteriasNames.length === 0 ? (
            <>
              <div className="my-5 font-sans text-xl font-bold text-black">
                Общая оценка
              </div>
              <div className="flex items-center justify-between gap-16 mb-5 w-96">
                <div className="text-base font-normal text-black font-inter">
                  Общая оценка
                </div>
                <div> {renderMarkContent(0, 0)} </div>
              </div>
            </>
          ) : (
            <>
              <div className="my-5 font-sans text-xl font-bold text-black">
                Критерии
              </div>
              {currentEvent?.criteriasNames.map((criteriaName, index) => (
                <div
                  className="flex items-center justify-between gap-16 mb-5 w-96"
                  key={currentEvent.criterias && currentEvent.criterias[index]}
                >
                  <div className="text-base font-normal text-black font-inter">
                    {criteriaName}
                  </div>
                  <div>
                    {' '}
                    {renderMarkContent(
                      currentEvent.criterias[index],
                      index
                    )}{' '}
                  </div>
                </div>
              ))}
            </>
          )}

          <div className="my-5 font-sans text-xl font-bold text-black">
            Комментарий
          </div>
          <textarea
            className="p-3 font-sans text-sm border border-solid border-gray rounded-xl h-36 w-96"
            placeholder="Введите комментарий"
            {...register('comment')}
          />

          <div className="flex gap-3 mt-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-3 font-bold text-black font-inter rounded-xl bg-another_white"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-5 py-3 font-bold text-white font-inter rounded-xl bg-blue"
            >
              Отправить ответ
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default TeamEvaluationPage;
