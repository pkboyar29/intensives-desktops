import { FC } from 'react';

interface ChipProps {
  label: string;
  clickHandler?: () => void;
}

// TODO: change bg color
const Chip: FC<ChipProps> = ({ label, clickHandler }) => {
  return (
    <div
      onClick={clickHandler}
      className="inline-block px-4 text-lg bg-gray_4 rounded-xl text-black_2"
    >
      {label}
    </div>
  );
};

export default Chip;
