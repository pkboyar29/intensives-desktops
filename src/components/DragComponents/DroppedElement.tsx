import { FC } from 'react';
import { useDrag } from 'react-dnd';

import CrossIcon from '../icons/CrossIcon';

import { ItemTypes } from './ItemTypes';
import { IStudent } from '../../ts/interfaces/IStudent';

interface DroppedElementProps {
  element: IStudent;
  onDelete: (studentToDelete: IStudent) => void;
}

const DroppedElement: FC<DroppedElementProps> = ({ element, onDelete }) => {
  const [, dragRef] = useDrag({
    type: ItemTypes.STUDENT,
    item: element,
    collect: (monitor) => ({
      isDragStart: monitor.isDragging(),
      canDrag: monitor.canDrag(),
    }),
  });

  return (
    <div
      ref={dragRef}
      className="flex items-center w-full gap-3 px-3 py-1 text-base rounded-xl bg-gray_5"
    >
      <span className="flex-grow">{element.nameWithGroup}</span>
      <button
        onClick={() => {
          onDelete(element);
        }}
      >
        <CrossIcon />
      </button>
    </div>
  );
};

export default DroppedElement;
