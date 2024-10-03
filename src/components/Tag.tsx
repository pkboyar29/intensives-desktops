import { FC } from 'react';
import krest from '../icons/krest.svg';

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
        <img className="h-2.5 w-2.5 fill-black" loading="lazy" src={krest} />
      </button>
    </div>
  );
};

export default Tag;
