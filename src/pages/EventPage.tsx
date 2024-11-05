import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAppSelector } from '../redux/store';

import { useLazyGetEventQuery } from '../redux/api/eventApi';

import { IManagerEvent } from '../ts/interfaces/IEvent';

import PrimaryButton from '../components/PrimaryButton';
import TrashIcon from '../components/icons/TrashIcon';
import Title from '../components/Title';
import Skeleton from 'react-loading-skeleton';

import { replaceLastURLSegment } from '../helpers/urlHelpers';

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

          console.log(data);

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

              <div className="mt-3 text-base font-bold">
                {event.startTime} - {event.finishTime}
              </div>

              <p className="mt-3 text-lg text-black_2">{event.description}</p>

              {/* <div className="flex flex-col gap-2">
                <div className="text-lg font-bold text-black_2">
                  Место проведения
                </div>
                <div>{event.audience}</div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-lg font-bold text-black_2">
                  Участвующие команды
                </div>
                <div></div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-lg font-bold text-black_2">
                  Эксперты, проводящие мероприятие
                </div>
                <div></div>
              </div> */}

              {/* TODO: эту роль очевидно потом поменять на роль организатора */}
              {currentUser?.roleName === 'Супер-администратор' && (
                <div className="flex mt-10 text-lg font-bold gap-7">
                  <PrimaryButton
                    text="Редактировать"
                    clickHandler={() => {
                      navigate(
                        replaceLastURLSegment(`editEvent?eventId=${event.id}`)
                      );
                    }}
                  />

                  <button
                    className="p-4 rounded-[10px] bg-another_white flex justify-center items-center cursor-pointer"
                    onClick={() => console.log('типо удаление')}
                  >
                    <TrashIcon />
                  </button>
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
