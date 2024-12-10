import { FC } from 'react';

interface SwitchButtonProps {
  leftSideText: string;
  rightSideText: string;
  currentSide: 'left' | 'right';
  onSideClick: (side: 'left' | 'right') => void;
}

const SwitchButton: FC<SwitchButtonProps> = ({
  leftSideText,
  rightSideText,
  currentSide,
  onSideClick,
}) => {
  return (
    <div
      className={`flex text-base cursor-pointer h-9 bg-another_white rounded-3xl box-shadow relative
    before:content-[''] before:h-full before:w-1/2 before:absolute before:bg-blue before:rounded-3xl before:transition-all before:ease-in-out before:duration-300 ${
      currentSide === 'left'
        ? 'before:translate-x-0'
        : 'before:translate-x-full'
    }`}
    >
      <div
        onClick={() => onSideClick('left')}
        className={`flex items-center justify-center basis-1/2 rounded-3xl ${
          currentSide === 'left' ? 'text-white' : 'text-black'
        }`}
      >
        <span className="z-10">{leftSideText}</span>
      </div>
      <div
        onClick={() => onSideClick('right')}
        className={`flex items-center justify-center basis-1/2 rounded-3xl ${
          currentSide === 'right' ? 'text-white' : 'text-black'
        }`}
      >
        <span className="z-10">{rightSideText}</span>
      </div>
    </div>
  );
};

export default SwitchButton;
