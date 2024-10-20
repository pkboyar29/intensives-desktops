import { FC } from 'react';
import { useDrag } from 'react-dnd';

import { ItemTypes } from './ItemTypes';
import { IStudent } from '../../ts/interfaces/IStudent';

// { id: number; content: string }
interface DragElementProps {
  data: IStudent;
}

const DragElement: FC<DragElementProps> = ({ data }) => {
  const [, dragRef] = useDrag({
    type: ItemTypes.STUDENT,
    item: data,
  });

  return (
    <div
      ref={dragRef}
      className="flex items-center justify-center w-[200px] text-base bg-gray_5 px-3 py-1 rounded-xl overflow-hidden whitespace-nowrap text-ellipsis"
    >
      {data.nameWithGroup}
    </div>
  );
};

export default DragElement;
