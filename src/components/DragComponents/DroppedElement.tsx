import { useDrag } from 'react-dnd';

import CrossIcon from '../icons/CrossIcon';

import { ItemTypes } from './ItemTypes';

interface DroppedElementProps<T extends { id: number; content: string }> {
  element: T;
  onDelete: (elementToDelete: T) => void;
}

const DroppedElement = <T extends { id: number; content: string }>({
  element,
  onDelete,
}: DroppedElementProps<T>) => {
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
      className="flex items-center gap-3 px-3 py-1 text-base rounded-xl bg-gray_5"
    >
      <span className="flex-grow">{element.content}</span>
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
