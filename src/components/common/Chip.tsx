import { FC } from 'react';

import CrossIcon from '../icons/CrossIcon';

interface ChipProps {
  label: string;
  size?: 'big' | 'small';
  clickHandler?: () => void;
  shouldHaveCrossIcon?: boolean;
  deleteHandler?: () => void;
}

const Chip: FC<ChipProps> = ({
  label,
  size = 'small',
  shouldHaveCrossIcon = false,
  deleteHandler,
  clickHandler,
}) => {
  return (
    <div
      onClick={clickHandler}
      className={`bg-gray_5 rounded-xl text-black_2 text-[14.5px] md:text-lg flex items-center justify-center gap-3 ${
        size === 'small' ? `md:px-4 px-2.5` : `px-14`
      }`}
    >
      <span className="text-center">{label}</span>

      {shouldHaveCrossIcon && deleteHandler && (
        <button type="button" className="w-3 h-3" onClick={deleteHandler}>
          <CrossIcon />
        </button>
      )}
    </div>
  );
};

export default Chip;
