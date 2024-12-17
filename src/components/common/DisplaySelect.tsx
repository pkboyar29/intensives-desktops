import { FC, ReactNode } from 'react';

import CaretIcon from '../icons/CaretIcon';

interface DisplaySelectProps {
  dropdownText: string;
  isOpen: boolean;
  onDropdownClick: () => void;
  children: ReactNode;
}

const DisplaySelect: FC<DisplaySelectProps> = ({
  dropdownText,
  children,
  isOpen,
  onDropdownClick,
}) => {
  return (
    <div className="relative inline-flex flex-col">
      <button
        onClick={onDropdownClick}
        className="px-2.5 py-1.5 rounded-xl bg-another_white h-[34px] flex gap-1.5 items-center justify-between transition duration-300 ease-in-out hover:bg-black_gray"
      >
        <div className="text-base font-bold">{dropdownText}</div>
        <CaretIcon isOpen={isOpen} />{' '}
      </button>
      {isOpen && (
        <div className="absolute left-0 z-10 bg-white top-full">
          <div className="p-2 border-2 border-solid rounded-lg border-another_white">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplaySelect;
