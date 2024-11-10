import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAppSelector } from '../redux/store';

import { useLazyGetEventQuery } from '../redux/api/eventApi';

import { IManagerEvent } from '../ts/interfaces/IEvent';

import PrimaryButton from '../components/PrimaryButton';
import TrashIcon from '../components/icons/TrashIcon';
import Title from '../components/Title';
import Skeleton from 'react-loading-skeleton';
import Chip from '../components/Chip';

import { replaceLastURLSegment } from '../helpers/urlHelpers';
import { getTimeFromDate } from '../helpers/dateHelpers';

const EventPage: FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [getEvent, { isLoading }] = useLazyGetEventQuery();
  const [event, setEvent] = useState<IManagerEvent>();

  const currentUser = useAppSelector((state) => state.user.data);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (params.eventId) {
          const { data } = await getEvent(parseInt(params.eventId));

          setEvent(data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchEvent();
  }, []);

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
                      Эксперты, проводящие мероприятие
                    </div>
                    <div className="flex gap-3">
                      {event.experts.map((expert) => (
                        <Chip key={expert.id} label={expert.name} />
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
                        replaceLastURLSegment(`editEvent?eventId=${event.id}`)
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
