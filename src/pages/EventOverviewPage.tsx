import { FC, useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import authHeader from '../helpers/getHeaders';

import { EventsContext } from '../context/EventsContext';
import { CurrentUserContext } from '../context/CurrentUserContext';

import { ITeam } from '../ts/interfaces/ITeam';

import Title from '../components/Title';
import OverviewContent from '../components/OverviewContent';
import OverviewItem from '../components/OverviewItem';

type AnswerSubmitValues = {
  textAnswer: string;
};

const EventOverviewPage: FC = () => {
  const { currentEvent, setCurrentEventById } = useContext(EventsContext);
  const { currentUser } = useContext(CurrentUserContext);
  const [currentAnswer, setCurrentAnswer] = useState<any>(); // currentAnswer.text
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const params = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm<AnswerSubmitValues>({
    mode: 'onBlur',
  });

  const onSubmit = async (data: AnswerSubmitValues) => {
    if (params.eventId && params.teamId) {
      const requestData = {
        text: data.textAnswer,
        event: parseInt(params.eventId, 10),
        student: currentUser?.student_id,
        command: parseInt(params.teamId, 10),
      };
      try {
        if (currentAnswer) {
          const updateResponse = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/answers/${currentAnswer.id}/`,
            requestData,
            { headers: await authHeader() }
          );
          console.log(updateResponse.data);
          setCurrentAnswer(updateResponse.data);
        } else {
          const postResponse = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/answers/`,
            requestData,
            { headers: await authHeader() }
          );
          console.log(postResponse.data);
          setCurrentAnswer(postResponse.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteAnswer = async () => {
    try {
      const deleteResponse = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/answers/${currentAnswer.id}/`,
        { headers: await authHeader() }
      );
      console.log(deleteResponse.data);
      reset({ textAnswer: '' });
      setCurrentAnswer(undefined);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (params.eventId) {
        await setCurrentEventById(parseInt(params.eventId));

        if (params.teamId) {
          const allAnswersResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/answers/`,
            { headers: await authHeader() }
          );
          const allAnswers = allAnswersResponse.data.results;
          // console.log('все ответы это ', allAnswers)
          const currentAnswer = allAnswers.find(
            (answer: any) =>
              answer.event == params.eventId && answer.command == params.teamId
          );
          if (currentAnswer) {
            reset({ textAnswer: currentAnswer.text });
            await setCurrentAnswer(currentAnswer);
          }
          // console.log('текущий ответ это ', currentAnswer)
        }

        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.eventId]);

  if (isLoading) {
    return <div className="mt-3 font-sans text-2xl font-bold">Загрузка...</div>;
  }

  return (
    <>
      <Title text="Просмотр мероприятия" />

      <OverviewContent>
        <OverviewItem title="Название команды" value={currentEvent?.name} />
        <OverviewItem
          title="Описание мероприятия"
          value={currentEvent?.description}
        />
        <OverviewItem title="Этап" value={currentEvent?.stageName} />
        <OverviewItem
          title="Дата начала мероприятия"
          value={currentEvent?.startDate.toLocaleString()}
        />
        <OverviewItem
          title="Дата окончания мероприятия"
          value={currentEvent?.finishDate.toLocaleString()}
        />
        <OverviewItem title="Аудитория" value={currentEvent?.auditoryName} />
        <OverviewItem
          title="Шкала оценивания"
          value={currentEvent?.markStrategyName}
        />

        {currentEvent?.isCurrentTeacherJury && (
          <div>
            <h2 className="font-sans text-xl font-bold text-black">
              Вы являетесь жюри в этом интенсиве
            </h2>
          </div>
        )}
        <div>
          <h2 className="font-sans text-xl font-bold text-black">
            Прикрепленные команды
          </h2>
          <div className="mt-2 font-sans text-base text-bright_gray">
            {currentEvent?.teams.map((team: ITeam) => (
              <div key={team.id} className="flex items-center gap-8 mb-5">
                <div key={team.id}>{team.name}</div>
                {currentEvent?.isCurrentTeacherJury &&
                  currentEvent.markStrategyId !== 1 &&
                  currentUser?.user_role_id === 3 && (
                    <button
                      onClick={() =>
                        navigate(
                          `/teacher/${params.intensiveId}/team-evaluation/${params.eventId}/${team.id}`
                        )
                      }
                      className="px-5 py-2 font-sans text-sm font-bold text-white bg-blue rounded-xl"
                    >
                      поставить оценку
                    </button>
                  )}
              </div>
            ))}
          </div>
        </div>

        {currentUser?.user_role_id === 1 &&
          currentEvent?.resultTypeId !== 1 && (
            <>
              <h2 className="font-sans text-xl font-bold text-black">
                Отправка ответа
              </h2>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-3 w-[500px]"
              >
                <textarea
                  className="p-3 font-sans text-base border border-solid border-gray rounded-xl h-36"
                  placeholder="Введите текстовый ответ"
                  {...register('textAnswer')}
                />
                <div className="flex self-end gap-4">
                  {currentAnswer && (
                    <button
                      type="button"
                      onClick={deleteAnswer}
                      className="self-end px-5 py-3 mb-10 font-bold text-white font-inter rounded-xl bg-red w-36"
                    >
                      Удалить
                    </button>
                  )}
                  <button
                    type="submit"
                    className="self-end px-5 py-3 mb-10 font-bold text-white font-inter rounded-xl bg-blue w-36"
                  >
                    {currentAnswer ? 'Обновить' : 'Отправить'}
                  </button>
                </div>
              </form>
            </>
          )}
      </OverviewContent>
    </>
  );
};

export default EventOverviewPage;
