import { FC } from 'react';
import { useDrag } from 'react-dnd';

import CrossIcon from '../icons/CrossIcon';

import { ItemTypes } from './ItemTypes';
import { DropResult } from './DragContainer';

import { IStudent } from '../../ts/interfaces/IStudent';

// { id: number; content: string }
interface DroppedElementProps {
  data: IStudent;
  onDropSuccess: (newDroppedElement: IStudent) => void;
  onDelete: (elementToDelete: IStudent) => void;
}

const DroppedElement: FC<DroppedElementProps> = ({
  data,
  onDropSuccess,
  onDelete,
}) => {
  const [, dragRef] = useDrag({
    type: ItemTypes.STUDENT,
    item: data,
    collect: (monitor) => ({
      isDragStart: monitor.isDragging(),
      canDrag: monitor.canDrag(),
    }),
    end: (_, monitor) => {
      const didDrop = monitor.didDrop();
      const dropResult = monitor.getDropResult() as DropResult;

      if (didDrop && dropResult.isDroppedInTheSameContainer) {
        return;
      }

      if (didDrop) {
        onDropSuccess(data);
      }
    },
  });

  return (
    <div
      ref={dragRef}
      className="flex items-center gap-3 px-3 py-1 text-base rounded-xl bg-gray_5"
    >
      <span className="flex-grow">{data.nameWithGroup}</span>
      <button
        onClick={() => {
          onDelete(data);
        }}
      >
        <CrossIcon />
      </button>
    </div>
  );
};

export default DroppedElement;
