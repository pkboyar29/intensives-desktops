import { useDrop } from 'react-dnd';

import Tag from '../common/Tag';
import TeamIcon from '../icons/TeamIcon';

import { ItemTypes } from './ItemTypes';
import { ISupportTeamForManager } from '../../ts/interfaces/ITeam';

// TODO: можно тут также отображать тимлида

interface SupportTeamDragContainerProps<
  DroppedElementType extends { id: number; content: string; isTutor: boolean }
> {
  team: ISupportTeamForManager;
  allStudents: { id: number; name: string }[];
  allTeachers: { id: number; name: string }[];
  onDrop: (droppedElement: DroppedElementType) => void;
  onDelete: (deletedElement: DroppedElementType) => void;
}

const SupportTeamDragContainer = <
  DroppedElementType extends { id: number; content: string; isTutor: boolean }
>({
  team,
  allStudents,
  allTeachers,
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

  const onSelectTutor = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const teacher = allTeachers.find((t) => t.id === Number(e.target.value));

    const element = {
      id: teacher!.id,
      content: teacher!.name,
      isTutor: true,
    };
    onDrop(element as DroppedElementType);
  };

  const onSelectMentor = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const student = allStudents.find((s) => s.id === Number(e.target.value));

    const element = {
      id: student!.id,
      content: student!.name,
      isTutor: false,
    };
    onDrop(element as DroppedElementType);
  };

  return (
    <div
      ref={dropRef}
      className={
        isDragging
          ? 'flex gap-4 py-1 px-1.5 sm:py-2.5 sm:px-4 min-w-[300px] max-w-[400px] outline outline-[3px] outline-gray_5 rounded-lg select-none'
          : 'flex gap-4 py-1 px-1.5 sm:py-2.5 sm:px-4 min-w-[300px] max-w-[400px] select-none'
      }
    >
      <div className="transition duration-300 hidden sm:flex items-center justify-center bg-gray_5 hover:bg-gray_6 rounded-[10px] w-12 h-12">
        <TeamIcon />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg text-black_3">{team.name}</span>
        </div>

        {team.tutor ? (
          <div className="w-full flex gap-1.5 md:gap-3 h-9">
            <div className="flex items-center justify-center p-3 text-base font-bold leading-none rounded-lg w-9 bg-gray_5">
              Т
            </div>
            <Tag
              content={team.tutor.name}
              shouldHaveCrossIcon={true}
              deleteHandler={() => {
                onDelete({
                  id: team.tutor?.id,
                  content: team.tutor?.name,
                  isTutor: true,
                } as DroppedElementType);
              }}
            />
          </div>
        ) : (
          <div className="text-bright_gray">Нет тьютора</div>
        )}

        {team.mentor ? (
          <div className="w-full flex gap-1.5 md:gap-3 h-9">
            <div className="flex items-center justify-center p-3 text-base font-bold leading-none rounded-lg w-9 bg-gray_5">
              Н
            </div>
            <Tag
              content={team.mentor.name}
              shouldHaveCrossIcon={true}
              deleteHandler={() => {
                onDelete({
                  id: team.mentor?.id,
                  content: team.mentor?.name,
                  isTutor: false,
                } as DroppedElementType);
              }}
            />
          </div>
        ) : (
          <div className="text-bright_gray">Нет наставника</div>
        )}

        {team.studentsInTeam.length === 0 && (
          <span className="text-base text-gray_3">Нет участников</span>
        )}

        <div className="w-full flex flex-col gap-1.5">
          {team.studentsInTeam.map((studentInTeam) => (
            <Tag
              key={studentInTeam.student.id}
              content={studentInTeam.student.nameWithGroup}
              shouldHaveCrossIcon={false}
            />
          ))}
        </div>

        <select
          value={0}
          className="block md:hidden mt-[4px] cursor-pointer px-3 py-1 text-base rounded-xl border-none outline-none bg-gray_5 w-full"
          onChange={onSelectTutor}
        >
          <option value={0}>Выбрать тьютора</option>
          {allTeachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>

        <select
          value={0}
          className="block md:hidden mt-[4px] cursor-pointer px-3 py-1 text-base rounded-xl border-none outline-none bg-gray_5 w-full"
          onChange={onSelectMentor}
        >
          <option value={0}>Выбрать наставника</option>
          {allStudents.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SupportTeamDragContainer;
