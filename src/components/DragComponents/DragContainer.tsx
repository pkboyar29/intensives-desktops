import { useDrop } from 'react-dnd';

import DroppedElement from './DroppedElement';
import TeamIcon from '../icons/TeamIcon';

import { ItemTypes } from './ItemTypes';

interface DragContainerProps<T extends { id: number; content: string }> {
  containerName: string;
  droppedElements: T[];
  onDrop: (droppedElement: T) => void;
  onDelete: (deletedElement: T) => void;
}

// TODO: убрать из DragContainer все, что связано с командой?
const DragContainer = <T extends { id: number; content: string }>({
  containerName,
  droppedElements,
  onDrop,
  onDelete,
}: DragContainerProps<T>) => {
  const [{ isDragging }, dropRef] = useDrop({
    accept: ItemTypes.STUDENT,
    drop(newDroppedElement: T) {
      const isDroppedInTheSameContainer: boolean = droppedElements.some(
        (existingDroppedElement: T) =>
          existingDroppedElement.id === newDroppedElement.id
      );
      if (isDroppedInTheSameContainer) {
        return;
      }

      onDrop(newDroppedElement);
    },
    collect: (monitor) => ({
      isDragging: monitor.isOver(),
    }),
  });

  const deleteElementFromContainer = (elementToDelete: T) => {
    onDelete(elementToDelete);
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
              element={droppedElement}
              onDelete={deleteElementFromContainer}
            />
          ))}
        </div>

        {/* <select className="mt-[4px] cursor-pointer px-4 py-1.5 text-base rounded-lg border-none outline-none bg-gray_5 w-min appearance-none">
          <option>
            <div>Добавить участника</div>
          </option>
        </select> */}
      </div>
    </div>
  );
};

export default DragContainer;
