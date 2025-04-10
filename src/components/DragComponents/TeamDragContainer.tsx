import { FC } from 'react';
import { useDrop } from 'react-dnd';

import DroppedElement from './DroppedElement';
import TeamIcon from '../icons/TeamIcon';

import { ItemTypes } from './ItemTypes';
import { IStudent } from '../../ts/interfaces/IStudent';

interface TeamDragContainerProps {
  containerName: string;
  droppedStudents: IStudent[];
  onDrop: (droppedStudent: IStudent) => void;
  onDelete: (deletedStudent: IStudent) => void;
}

// TODO: тут начать использовать компонент Tag?
// если передавать team типа ITeam, то возможно не имеет смысла разделять компонент на два?
// начать отображать тьютора и наставника также тут?
const TeamDragContainer: FC<TeamDragContainerProps> = ({
  containerName,
  droppedStudents,
  onDrop,
  onDelete,
}) => {
  const [{ isDragging }, dropRef] = useDrop({
    accept: ItemTypes.STUDENT,
    drop(newDroppedStudent: IStudent) {
      const isDroppedInTheSameContainer: boolean = droppedStudents.some(
        (existingDroppedStudent: IStudent) =>
          existingDroppedStudent.id === newDroppedStudent.id
      );
      if (isDroppedInTheSameContainer) {
        return;
      }

      onDrop(newDroppedStudent);
    },
    collect: (monitor) => ({
      isDragging: monitor.isOver(),
    }),
  });

  const deleteStudentFromContainer = (studentToDelete: IStudent) => {
    onDelete(studentToDelete);
  };

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

      <div className="flex flex-col gap-1">
        <div className="flex items-center space-x-2">
          <span className="text-lg text-black_3">{containerName}</span>
        </div>

        {droppedStudents.length === 0 && (
          <span className="text-base text-gray_3">Нет участников</span>
        )}

        <div className="flex flex-col gap-[6px]">
          {droppedStudents.map((droppedStudent) => (
            <DroppedElement
              key={droppedStudent.id}
              element={droppedStudent}
              onDelete={deleteStudentFromContainer}
            />
          ))}
        </div>

        {/* TODO: добавить при адаптивной верстке */}
        {/* <select className="mt-[4px] cursor-pointer px-4 py-1.5 text-base rounded-lg border-none outline-none bg-gray_5 w-min appearance-none">
          <option>
            <div>Добавить участника</div>
          </option>
        </select> */}
      </div>
    </div>
  );
};

export default TeamDragContainer;
