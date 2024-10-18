import { useState, FC, useEffect } from 'react';
import { useDrop } from 'react-dnd';

import DroppedElement from './DroppedElement';
import TeamIcon from '../icons/TeamIcon';

import { ItemTypes } from './ItemTypes';
import { IStudent } from '../../ts/interfaces/IStudent';

// TODO: МБ КАК-ТО МОЖНО ПЕРЕМЕСТИТЬ SETALLELEMENTS И ALLELEMENTS В ONDROP. ХОТЯ НАВЕРНОЕ ВСЕ НЕ ТАК ПРОСТО...
// А ЕСЛИ DROPPEDELEMENTS ПЕРЕДАВАТЬ СВОЙСТВОМ МБ ПОЛЕГЧЕ БУДЕТ?
interface DragContainerProps {
  containerName: string;
  setAllElements: (elements: IStudent[]) => void;
  allElements: IStudent[];
  onDrop: (droppedElements: IStudent[]) => void;
  initialDroppedElements: IStudent[];
}

export interface DropResult {
  isDroppedInTheSameContainer: boolean;
}

const DragContainer: FC<DragContainerProps> = ({
  containerName,
  setAllElements,
  allElements,
  onDrop,
  initialDroppedElements,
}) => {
  const [droppedElements, setDroppedElements] = useState<IStudent[]>([]);

  const [{ isDragging }, dropRef] = useDrop({
    accept: ItemTypes.STUDENT,
    drop(newDroppedElement: IStudent): DropResult {
      const isDroppedInTheSameContainer: boolean = droppedElements.some(
        (existingDroppedElement: IStudent) =>
          existingDroppedElement.id === newDroppedElement.id
      );

      if (isDroppedInTheSameContainer) {
        return { isDroppedInTheSameContainer: true };
      }

      setDroppedElements([...droppedElements, newDroppedElement]);
      setAllElements(
        allElements.filter(
          (freeStudent: IStudent) => freeStudent.id !== newDroppedElement.id
        )
      );

      return { isDroppedInTheSameContainer: false };
    },
    collect: (monitor) => ({
      isDragging: monitor.isOver(),
    }),
  });

  useEffect(() => {
    onDrop(droppedElements);
  }, [droppedElements]);

  useEffect(() => {
    setDroppedElements(initialDroppedElements);
  }, []);

  const deleteElementFromContainer = (elementToDelete: IStudent) => {
    setDroppedElements(
      droppedElements.filter(
        (draggedElement: IStudent) => elementToDelete.id != draggedElement.id
      )
    );
    setAllElements([...allElements, elementToDelete]);
  };

  const afterSuccessfulDrop = (newDroppedElement: IStudent) => {
    setDroppedElements(
      droppedElements.filter(
        (droppedElement: IStudent) => droppedElement.id !== newDroppedElement.id
      )
    );
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
      <TeamIcon />

      <div className="flex flex-col gap-1">
        <div className="flex items-center space-x-2">
          <span className="text-lg text-black_3">{containerName}</span>
        </div>

        {droppedElements.length === 0 && (
          <span className="text-base text-gray_3">Нет участников</span>
        )}

        <div className="flex flex-col gap-[6px]">
          {droppedElements.map((droppedElement) => (
            <DroppedElement
              key={droppedElement.id}
              data={droppedElement}
              onDropSuccess={afterSuccessfulDrop}
              onDelete={deleteElementFromContainer}
            />
          ))}
        </div>

        <select className="mt-[4px] cursor-pointer px-4 py-1.5 text-base rounded-lg border-none outline-none bg-gray_5 w-min appearance-none">
          <option>
            <div>Добавить участника</div>
          </option>
        </select>
      </div>
    </div>
  );
};

export default DragContainer;
