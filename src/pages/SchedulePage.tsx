import { FC } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

import { useGetEventsOnIntensiveQuery } from '../redux/api/eventApi';

import { IManagerEvent } from '../ts/interfaces/IEvent';

import Title from '../components/Title';
import PrimaryButton from '../components/PrimaryButton';

import { replaceLastURLSegment } from '../helpers/urlHelpers';

const SchedulePage: FC = () => {
  const { intensiveId } = useParams();
  const navigate = useNavigate();

  if (!intensiveId) {
    throw new Error('Missing intensiveId in URL');
  }

  const { data: events } = useGetEventsOnIntensiveQuery(Number(intensiveId), {
    refetchOnMountOrArgChange: true,
  });

  interface EventProps {
    event: IManagerEvent;
  }

  const eventClickHandler = (eventId: number) => {
    navigate(`${replaceLastURLSegment('editEvent')}?eventId=${eventId}`);
  };

  const Event: FC<EventProps> = ({ event }) => (
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
          <time className="text-[#637087] text-base">
            {event.dateStart + ' ' + event.dateEnd}
          </time>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen min-w-[50vw] max-w-[1280px]">
      <div className="flex items-center justify-between">
        <Title text="План интенсива" />
        <button className="px-2.5 py-1.5 rounded-xl bg-[#f0f2f5] h-[34px] flex justify-center items-center cursor-pointer">
          <div className="text-base font-bold">Редактировать</div>{' '}
        </button>
      </div>

      <div className="flex gap-3 mt-5">
        <div>
          <PrimaryButton
            text="Добавить мероприятие"
            clickHandler={() => navigate(replaceLastURLSegment('editEvent'))}
          />
        </div>
        <div>
          <PrimaryButton
            text="Добавить этап"
            clickHandler={() => console.log('stage')}
          />
        </div>
      </div>

      {events?.map((event) => (
        <Event key={event.id} event={event} />
      ))}
    </div>
  );
};

export default SchedulePage;
