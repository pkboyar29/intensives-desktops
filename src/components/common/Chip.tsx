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
      className={`bg-gray_5 rounded-xl text-black_2 text-lg flex items-center gap-3 ${
        size === 'small' ? `px-4` : `px-14`
      }`}
    >
      <span>{label}</span>

      {shouldHaveCrossIcon && deleteHandler && (
        <button type="button" className="w-3 h-3" onClick={deleteHandler}>
          <CrossIcon />
        </button>
      )}
    </div>
  );
};

export default Chip;
