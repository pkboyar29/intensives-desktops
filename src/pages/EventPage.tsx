import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAppSelector } from '../redux/store';

import { useGetEventQuery } from '../redux/api/eventApi';

import PrimaryButton from '../components/PrimaryButton';
import TrashIcon from '../components/icons/TrashIcon';
import Title from '../components/Title';
import Skeleton from 'react-loading-skeleton';
import Chip from '../components/Chip';

import { getTimeFromDate } from '../helpers/dateHelpers';

const EventPage: FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { data: event, isLoading } = useGetEventQuery(Number(params.eventId), {
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
  }, [event]);

  const currentUser = useAppSelector((state) => state.user.data);

  return (
    <div className="flex justify-center max-w-[1280px]">
      <div className="max-w-[765px] w-full">
        {isLoading ? (
          <Skeleton />
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
                  <div className="font-bold text-black_2">Место проведения</div>
                  <div>{event.audience.name}</div>
                </div>

                {event.teams.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <div className="text-lg font-bold text-black_2">
                      Участвующие команды
                    </div>
                    <div className="flex gap-3">
                      {event.teams.map((team) => (
                        <Chip key={team.id} label={team.name} />
                      ))}
                    </div>
                  </div>
                )}

                {event.experts.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <div className="text-lg font-bold text-black_2">
                      Преподаватели, проводящие мероприятие
                    </div>
                    <div className="flex gap-3">
                      {event.experts.map((expert) => (
                        <Chip key={expert.id} label={expert.name} />
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
                      <div className="flex gap-3">
                        {event.criterias.map((criteria) => (
                          <Chip key={criteria.id} label={criteria.name} />
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* TODO: эту роль очевидно потом поменять на роль организатора */}
              {currentUser?.roleName === 'Супер-администратор' && (
                <div className="flex mt-10 text-lg font-bold gap-7">
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
                      onClick={() => console.log('типо удаление')}
                    />
                  </div>
                </div>
              )}
            </>
          )
        )}
      </div>
    </div>
  );
};

export default EventPage;
