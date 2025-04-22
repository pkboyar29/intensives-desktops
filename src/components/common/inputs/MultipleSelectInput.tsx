import { useState } from 'react';
import { motion } from 'framer-motion';

import Checkbox from './Checkbox';
import ChipList from '../ChipList';
import ChevronDownIcon from '../../icons/ChevronDownIcon';

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

  const dropdownVariants = {
    open: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
    closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
  };

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
        <ChevronDownIcon
          className={`transition-transform duration-300 ${
            isOpen && `rotate-180`
          }`}
        />
      </button>

      <motion.div
        className={`bg-another_white rounded-b-xl text-bright_gray px-7 pb-4 select-none overflow-hidden max-h-[450px] overflow-y-auto`}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={dropdownVariants}
      >
        <div className="pb-8">
          <Checkbox
            item={{ id: 0, name: 'Выбрать все' }}
            addSelectedItem={() => {
              setSelectedItems(items);
            }}
            deleteSelectedItem={() => {
              setSelectedItems([]);
            }}
            isChecked={selectedItems.length === items.length}
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
      </motion.div>

      <div className="mt-2.5">
        <ChipList items={selectedItems} chipSize={chipSize} />
      </div>

      <div className="text-base text-red">{errorMessage}</div>
    </div>
  );
};

export default MultipleSelectInput;
