import { FC } from 'react';
import { useAppSelector } from '../../redux/store';
import { isCurrentRoleManager } from '../../helpers/userHelpers';
import { getEventDateDisplayString } from '../../helpers/dateHelpers';

import EyeIcon from '../icons/EyeIcon';

import { IEvent } from '../../ts/interfaces/IEvent';

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
  const currentUser = useAppSelector((state) => state.user.data);

  return (
    <section className="flex items-center gap-7">
      {currentUser?.currentRole &&
        isCurrentRoleManager(currentUser.currentRole) && (
          <button>
            <EyeIcon
              eyeVisibility={event.visibility}
              onClick={() => onEyeIconClick(event)}
            />
          </button>
        )}
      <div className="flex flex-col">
        <p
          onClick={() => onEventClick(event.id)}
          className="text-xl transition duration-300 ease-in-out cursor-pointer text-black_2 hover:text-blue"
        >
          {event.name}
        </p>
        <time className="text-base text-bright_gray">
          {getEventDateDisplayString(event.startDate, event.finishDate)}
        </time>
      </div>
    </section>
  );
};

export default EventInSchedule;
