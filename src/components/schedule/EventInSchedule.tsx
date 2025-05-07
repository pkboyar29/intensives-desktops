import { FC } from 'react';
import { useAppSelector } from '../../redux/store';
import { isUserManager, isUserTeacher } from '../../helpers/userHelpers';
import { getEventDateDisplayString } from '../../helpers/dateHelpers';

import EyeIcon from '../icons/EyeIcon';
import EditIcon from '../icons/EditIcon';
import Tooltip from '../common/Tooltip';

import { IEventShort } from '../../ts/interfaces/IEvent';

interface EventInScheduleProps {
  event: IEventShort;
  onEventClick: (eventId: number) => void;
  onEyeIconClick: (event: IEventShort) => void;
}

const EventInSchedule: FC<EventInScheduleProps> = ({
  event,
  onEventClick,
  onEyeIconClick,
}) => {
  const currentUser = useAppSelector((state) => state.user.data);

  return (
    <section className="flex items-center gap-7">
      {isUserManager(currentUser) && (
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
      {currentUser &&
        isUserTeacher(currentUser) &&
        event.teacherIds.includes(currentUser.id) && (
          <span className="self-start w-4 h-4">
            {' '}
            <Tooltip
              tooltipText="Вы учавствуете в этом мероприятии"
              tooltipClasses="p-1 bg-gray_5 rounded"
            >
              <EditIcon />
            </Tooltip>
          </span>
        )}
    </section>
  );
};

export default EventInSchedule;
