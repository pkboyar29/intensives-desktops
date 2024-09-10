import { FC, useEffect, useState } from 'react';
import PostService from '../API/PostService';
import { useParams } from 'react-router-dom';

import Title from '../components/Title/Title';

const SchedulePage: FC = () => {
  const { intensiveId } = useParams();

  const [events, setEvents] = useState<any[]>([]);

  const transformEvents = (unmappedEvents: any) => {
    if (unmappedEvents.length > 0) {
      let data: any[] = [];
      unmappedEvents.forEach((unmappedEvent: any) => {
        data.push({
          id: unmappedEvent.id,
          name: unmappedEvent.name,
          dataStart: unmappedEvent.start_dt,
          dataEnd: unmappedEvent.finish_dt,
        });
      });
      setEvents(data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (intensiveId) {
        const data = await PostService.getEvents(intensiveId);

        transformEvents(data.results);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log(events);
  }, [events]);

  interface EventProps {
    event: any;
  }

  const Event: FC<EventProps> = ({ event }) => (
    <section className="flex flex-col justify-center items-start px-4 py-4 w-full leading-[150%] max-md:max-w-full">
      <div
        key={event.name}
        className="flex p-4"
        onClick={() => {
          localStorage.setItem('idEvent', event.id);
          window.location.href = '/editEvent';
        }}
      >
        <div className="flex flex-col justify-center">
          <p className="text-xl">{event.name}</p>
          <time className="text-[#637087] text-base">
            {event.dataStart + ' ' + event.dataEnd}
          </time>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen min-w-[50vw] max-w-[1280px]">
      <div className="flex justify-between align-center">
        <Title text="План интенсива" />
        <button className="px-2.5 py-1.5 rounded-xl bg-[#f0f2f5] h-[34px] flex justify-center items-center cursor-pointer">
          <div className="text-base font-bold">Редактировать</div>{' '}
        </button>
      </div>

      {events?.map((event) => (
        <Event key={event.id} event={event} />
      ))}
    </div>
  );
};

export default SchedulePage;
