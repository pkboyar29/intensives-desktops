import { useDrag } from 'react-dnd';

import { ItemTypes } from './ItemTypes';

interface BaseDragElementProps<T extends { id: number; content: string }> {
  data: T;
}

const BaseDragElement = <T extends { id: number; content: string }>({
  data,
}: BaseDragElementProps<T>) => {
  const [, dragRef] = useDrag({
    type: ItemTypes.STUDENT,
    item: data,
  });

  return (
    <div
      ref={dragRef}
      className={`flex items-center justify-center px-3 py-1 overflow-hidden text-base cursor-pointer bg-gray_5 rounded-xl whitespace-nowrap text-ellipsis w-[200px]`}
    >
      {data.content}
    </div>
  );
};

export default BaseDragElement;
