import { FC } from 'react';

interface ChipProps {
  label: string;
  clickHandler?: () => void;
}

const Chip: FC<ChipProps> = ({ label, clickHandler }) => {
  return (
    <div
      onClick={clickHandler}
      className="bg-[#d6ddec] inline-block rounded-xl px-4 color-[#121217] text-lg"
    >
      {label}
    </div>
  );
};

export default Chip;
