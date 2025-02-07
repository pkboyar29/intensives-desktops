import { FC } from 'react';
import CrossIcon from '../icons/CrossIcon';

interface TagProps {
  content: string;
  shouldHaveCrossIcon: boolean;
  deleteHandler?: () => void;
}

const Tag: FC<TagProps> = ({ content, shouldHaveCrossIcon, deleteHandler }) => {
  return (
    <div
      className={`text-base bg-gray_5 hover:bg-gray_6 px-3 py-1 w-full flex items-center rounded-xl gap-[10px] ${
        shouldHaveCrossIcon ? 'justify-between' : 'justify-center'
      }`}
    >
      <span>{content}</span>

      {shouldHaveCrossIcon && deleteHandler && (
        <button className="w-3 h-3" onClick={deleteHandler}>
          <CrossIcon />
        </button>
      )}
    </div>
  );
};

export default Tag;
