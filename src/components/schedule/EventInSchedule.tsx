import { FC } from 'react';

import EyeIcon from '../icons/EyeIcon';

import { IEvent } from '../../ts/interfaces/IEvent';
import { getTimeFromDate } from '../../helpers/dateHelpers';

interface EventInScheduleProps {
  event: IEvent;
  onEventClick: (eventId: number) => void;
  onEyeIconClick: (event: IEvent) => void;
}

const EventInSchedule: FC<EventInScheduleProps> = ({
  event,
  onEventClick,
  onEyeIconClick,
}) => {
  return (
    <section className="flex items-center gap-7">
      <button>
        <EyeIcon
          eyeVisibility={event.visibility}
          onClick={() => onEyeIconClick(event)}
        />
      </button>
      <div className="flex flex-col">
        <p
          onClick={() => onEventClick(event.id)}
          className="text-xl transition duration-300 ease-in-out cursor-pointer text-black_2 hover:text-blue"
        >
          {event.name}
        </p>
        <time className="text-base text-bright_gray">
          {/* TODO: display here one day and startTime with finishTime */}
          {event.startDate.toLocaleDateString() +
            ' ' +
            getTimeFromDate(event.startDate) +
            ' - ' +
            getTimeFromDate(event.finishDate)}
        </time>
      </div>
    </section>
  );
};

export default EventInSchedule;
