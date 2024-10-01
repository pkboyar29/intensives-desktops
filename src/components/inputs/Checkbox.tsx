import { FC, useState } from 'react';

interface CheckboxProps {
  item: {
    id: number;
    name: string;
  };
  addSelectedItem: (itemId: number) => void;
  deleteSelectedItem: (itemId: number) => void;
  isChecked: boolean;
}

const Checkbox: FC<CheckboxProps> = ({
  item,
  addSelectedItem,
  deleteSelectedItem,
  isChecked,
}) => {
  const checkboxClickHandler = () => {
    if (!isChecked) {
      addSelectedItem(item.id);
    } else {
      deleteSelectedItem(item.id);
    }
  };

  return (
    <div
      id={item.id.toString()}
      onClick={() => checkboxClickHandler()}
      className="inline-flex items-center gap-2 cursor-pointer"
    >
      <span className="border-2 border-solid border-[#667080] rounded-md w-[18px] h-[18px] p-[1px] flex items-center justify-center">
        <svg
          className={`${!isChecked && 'hidden'}`}
          width="15"
          height="15"
          viewBox="0 0 15 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 8L4 11L14 1"
            stroke="#667080"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <p>{item.name}</p>
    </div>
  );
};

export default Checkbox;
