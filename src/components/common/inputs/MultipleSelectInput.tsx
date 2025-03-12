import { useState } from 'react';

import Checkbox from './Checkbox';
import Chip from '../Chip';

interface MultipleSelectInputProps<T> {
  description: string;
  errorMessage?: string;
  setErrorMessage?: (errorMessage: string) => void;
  items: T[];
  selectedItems: T[];
  setSelectedItems: (items: T[]) => void;
  chipSize?: 'small' | 'big';
}

const MultipleSelectInput = <T extends { id: number; name: string }>({
  description,
  errorMessage,
  setErrorMessage,
  items,
  selectedItems,
  setSelectedItems,
  chipSize = 'small',
}: MultipleSelectInputProps<T>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectAllState, setSelectAllState] = useState<boolean>(false);

  const toggleDropdownHandler = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const addSelectedItem = (id: number) => {
    const selectedItem = items.find((item) => item.id === id);

    if (selectedItem) {
      setSelectedItems([...selectedItems, selectedItem]);
    }

    if (setErrorMessage) {
      setErrorMessage('');
    }
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
        className={`mt-3 bg-another_white text-bright_gray py-3 px-4 rounded-t-xl w-full flex justify-between items-center ${
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

      <div
        className={`bg-another_white rounded-b-xl text-bright_gray px-7 pb-4 select-none ${
          !isOpen && `hidden`
        }`}
      >
        <div className="pb-8">
          <Checkbox
            item={{ id: 0, name: 'Выбрать все' }}
            addSelectedItem={() => {
              if (selectedItems.length !== items.length) {
                setSelectedItems(items);
              }
              setSelectAllState(true);
            }}
            deleteSelectedItem={() => {
              setSelectAllState(false);
            }}
            isChecked={selectAllState}
          />
        </div>
        <ul
          className={`transition-all duration-300 ease-in-out flex flex-col gap-2.5`}
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
      </div>

      <div className="flex flex-wrap gap-2 mx-3 mt-3">
        {selectedItems.map((selectedItem) => (
          <Chip
            key={selectedItem.id}
            label={selectedItem.name}
            size={chipSize}
          />
        ))}
      </div>

      <div className="text-base text-red">{errorMessage}</div>
    </div>
  );
};

export default MultipleSelectInput;
