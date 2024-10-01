import { FC, useState } from 'react';

import Checkbox from './Checkbox';

interface Item {
  id: number;
  name: string;
}

interface MultipleSelectInputProps {
  description: string;
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
  items: Item[];
  selectedItems: Item[];
  setSelectedItems: (items: Item[]) => void;
}

const MultipleSelectInput: FC<MultipleSelectInputProps> = ({
  description,
  errorMessage,
  setErrorMessage,
  items,
  selectedItems,
  setSelectedItems,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropdownHandler = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const addSelectedItem = (id: number) => {
    const selectedItem = items.find((item) => item.id === id);

    if (selectedItem) {
      setSelectedItems([...selectedItems, selectedItem]);
    }

    setErrorMessage('');
  };

  const deleteSelectedItem = (id: number) => {
    const newSelectedItems = selectedItems.filter((item) => item.id !== id);
    setSelectedItems(newSelectedItems);
  };

  return (
    <div className="flex flex-col text-lg">
      <div>{description}</div>

      <button
        onClick={toggleDropdownHandler}
        type="button"
        className={`mt-3 bg-[#f0f2f5] text-[#637087] py-3 px-4 rounded-t-xl w-full flex justify-between items-center ${
          !isOpen && `rounded-b-xl`
        }`}
      >
        <div>Выбрать</div>
        <svg
          className={`transition-transform duration-300 ${
            isOpen && `rotate-180`
          }`}
          width="15"
          height="9"
          viewBox="0 0 15 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.5 1.5L7.5 7.5L13.5 1.5"
            stroke="#667080"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <ul
        className={`bg-[#f0f2f5] rounded-b-xl text-[#637087] px-7 pb-4 select-none transition-all duration-300 ease-in-out flex flex-col gap-2.5 ${
          !isOpen && `hidden`
        }`}
      >
        {items.map((item) => (
          <Checkbox
            key={item.id}
            item={item}
            addSelectedItem={addSelectedItem}
            deleteSelectedItem={deleteSelectedItem}
            isChecked={selectedItems.some(
              (selectedItem) => selectedItem.id === item.id
            )}
          />
        ))}
      </ul>

      <div className="flex flex-wrap gap-2 mx-3 mt-3">
        {selectedItems.map((selectedItem) => (
          <div
            className="bg-[#D6DDEC] inline-block rounded-xl px-4 color-[#121217]"
            key={selectedItem.id}
          >
            {selectedItem.name}
          </div>
        ))}
      </div>

      <div className="mt-3 text-base text-red">{errorMessage}</div>
    </div>
  );
};

export default MultipleSelectInput;
