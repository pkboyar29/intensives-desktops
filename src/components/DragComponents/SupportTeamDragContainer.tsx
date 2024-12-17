import { useDrop } from 'react-dnd';

import Tag from '../common/Tag';
import TeamIcon from '../icons/TeamIcon';

import { ItemTypes } from './ItemTypes';

import { ITeam } from '../../ts/interfaces/ITeam';

interface SupportTeamDragContainerProps<
  DroppedElementType extends { id: number; content: string; isTutor: boolean }
> {
  team: ITeam;
  onDrop: (droppedElement: DroppedElementType) => void;
  onDelete: (deleteTutorOrMentor: boolean) => void;
}

const SupportTeamDragContainer = <
  DroppedElementType extends { id: number; content: string; isTutor: boolean }
>({
  team,
  onDelete,
  onDrop,
}: SupportTeamDragContainerProps<DroppedElementType>) => {
  const [{ isDragging }, dropRef] = useDrop({
    accept: ItemTypes.STUDENT,
    drop(newDroppedElement: DroppedElementType) {
      if (
        (newDroppedElement.isTutor &&
          team.tutor?.id === newDroppedElement.id) ||
        (!newDroppedElement.isTutor && team.mentor?.id === newDroppedElement.id)
      ) {
        return;
      }

      onDrop(newDroppedElement);
    },
    collect: (monitor) => ({
      isDragging: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={dropRef}
      className={
        isDragging
          ? 'flex gap-4 py-2.5 px-4 outline outline-[3px] outline-gray_5 rounded-lg select-none'
          : 'flex gap-4 py-2.5 px-4 select-none'
      }
    >
      <div className="transition duration-300 flex items-center justify-center bg-gray_5 hover:bg-gray_6 rounded-[10px] w-12 h-12">
        <TeamIcon />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg text-black_3">{team.name}</span>
        </div>

        {team.tutor ? (
          <div className="flex gap-3 h-9">
            <div className="flex items-center justify-center p-3 text-base font-bold leading-none rounded-lg w-9 bg-gray_5">
              Т
            </div>
            <Tag
              content={team.tutor.name}
              shouldHaveCrossIcon={true}
              deleteHandler={() => {
                onDelete(true);
              }}
            />
          </div>
        ) : (
          <div className="text-bright_gray">Нет тьютора</div>
        )}

        {team.mentor ? (
          <div className="flex gap-3 h-9">
            <div className="flex items-center justify-center p-3 text-base font-bold leading-none rounded-lg w-9 bg-gray_5">
              Н
            </div>
            <Tag
              content={team.mentor.nameWithGroup}
              shouldHaveCrossIcon={true}
              deleteHandler={() => {
                onDelete(false);
              }}
            />
          </div>
        ) : (
          <div className="text-bright_gray">Нет наставника</div>
        )}

        {team.studentsInTeam.length === 0 && (
          <span className="text-base text-gray_3">Нет участников</span>
        )}

        <div className="flex flex-col gap-[6px]">
          {team.studentsInTeam.map((student) => (
            <Tag
              key={student.id}
              content={student.nameWithGroup}
              shouldHaveCrossIcon={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportTeamDragContainer;
