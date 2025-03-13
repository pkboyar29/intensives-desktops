import { FC } from 'react';
import { useAppSelector } from '../../redux/store';
import { isCurrentRoleManager } from '../../helpers/userHelpers';

import EventInSchedule from './EventInSchedule';
import TrashIcon from '../icons/TrashIcon';
import EditIcon from '../icons/EditIcon';

import { IStage } from '../../ts/interfaces/IStage';
import { IEventShort } from '../../ts/interfaces/IEvent';

interface StageInScheduleProps {
  stage: IStage;
  stageEvents: IEventShort[];
  onEditClick: (stage: IStage) => void;
  onDeleteClick: (stageId: number) => void;
  onEventClick: (eventId: number) => void;
  onEventEyeIconClick: (event: IEventShort) => void;
}

const StageInSchedule: FC<StageInScheduleProps> = ({
  stage,
  stageEvents,
  onEditClick,
  onDeleteClick,
  onEventClick,
  onEventEyeIconClick,
}) => {
  const currentUser = useAppSelector((state) => state.user.data);

  return (
    <section>
      <div className="flex justify-between">
        <div className="flex flex-col gap-3">
          <div className="text-2xl font-bold text-black_2">{stage.name}</div>
          <div className="text-bright_gray">
            {stage.startDate.toLocaleDateString()} -{' '}
            {stage.finishDate.toLocaleDateString()}
          </div>
        </div>
        {currentUser?.currentRole &&
          isCurrentRoleManager(currentUser.currentRole) && (
            <div className="flex gap-4">
              <button
                className="w-9 h-9 rounded-[10px] bg-another_white hover:bg-black_gray transition duration-300 ease-in-out flex justify-center items-center"
                onClick={() => {
                  onEditClick(stage);
                }}
              >
                <EditIcon />
              </button>

              <button
                className="w-9 h-9 rounded-[10px] bg-another_white hover:bg-black_gray transition duration-300 ease-in-out flex justify-center items-center"
                onClick={() => {
                  onDeleteClick(stage.id);
                }}
              >
                <TrashIcon />
              </button>
            </div>
          )}
      </div>

      <div className="mt-2.5 ml-2.5">
        {stageEvents.length === 0 ? (
          <div className="text-lg text-black_2">
            В этом этапе нету мероприятий
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {stageEvents.map((event) => (
              <EventInSchedule
                key={event.id}
                event={event}
                onEventClick={(eventId) => onEventClick(eventId)}
                onEyeIconClick={(event) => onEventEyeIconClick(event)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default StageInSchedule;
