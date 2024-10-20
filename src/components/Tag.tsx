import { FC } from 'react';
import CrossIcon from './icons/CrossIcon';

interface TagProps {
  name: string;
  deleteHandler: () => void;
}

const Tag: FC<TagProps> = ({ name, deleteHandler }) => {
  return (
    <div className="text-sm bg-gray_5 px-2 py-1 rounded-[10px] max-w-max overflow-hidden whitespace-nowrap flex justify-between items-center gap-[5px]">
      <span className="w-full overflow-hidden mr-[10px] text-ellipsis whitespace-nowrap">
        {name}
      </span>

      <button className="w-3 h-3" onClick={deleteHandler}>
        <CrossIcon />
      </button>
    </div>
  );
};

export default Tag;
