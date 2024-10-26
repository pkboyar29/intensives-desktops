import { useDrag } from 'react-dnd';

import { ItemTypes } from './ItemTypes';

interface TeamDragElementProps<T extends { id: number; content: string }> {
  data: T;
}

const TeamDragElement = <T extends { id: number; content: string }>({
  data,
}: TeamDragElementProps<T>) => {
  const [, dragRef] = useDrag({
    type: ItemTypes.STUDENT,
    item: data,
  });

  return (
    <div
      ref={dragRef}
      className="flex items-center justify-center w-[200px] text-base bg-gray_5 px-3 py-1 rounded-xl overflow-hidden whitespace-nowrap text-ellipsis"
    >
      {data.content}
    </div>
  );
};

export default TeamDragElement;
