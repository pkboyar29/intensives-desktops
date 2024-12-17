import { FC } from 'react';

interface ChipProps {
  label: string;
  size?: 'big' | 'small';
  clickHandler?: () => void;
}

const Chip: FC<ChipProps> = ({ label, size = 'small', clickHandler }) => {
  return (
    <div
      onClick={clickHandler}
      className={`bg-gray_5 rounded-xl text-black_2 text-lg ${
        size === 'small' ? `px-4` : `px-14`
      }`}
    >
      {label}
    </div>
  );
};

export default Chip;
