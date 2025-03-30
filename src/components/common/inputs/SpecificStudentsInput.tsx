import { useState, useEffect, FC } from 'react';
import { motion } from 'framer-motion';
import { useLazyGetStudentsQuery } from '../../../redux/api/studentApi';

import Checkbox from './Checkbox';
import Chip from '../Chip';
import ChevronDownIcon from '../../icons/ChevronDownIcon';
import SearchIcon from '../../icons/SearchIcon';
import CrossIcon from '../../icons/CrossIcon';

interface Item {
  id: number;
  name: string;
}

interface SpecificStudentsInputProps {
  selectedItems: Item[];
  setSelectedItems: (items: Item[]) => void;
  flowsToExclude: number[];
}

const SpecificStudentsInput: FC<SpecificStudentsInputProps> = ({
  flowsToExclude,
  selectedItems,
  setSelectedItems,
}) => {
  const [getStudents] = useLazyGetStudentsQuery();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>();
  const [startTyping, setStartTyping] = useState<boolean>(false);

  const [students, setStudents] = useState<Item[]>([]);

  useEffect(() => {
    if (startTyping) {
      if (timer) {
        clearTimeout(timer);
      }

      const timeoutId = setTimeout(async () => {
        const { data } = await getStudents({
          search: searchText,
          flowsToExclude,
        });

        if (data) {
          setStudents(
            data.map((student) => ({
              id: student.id,
              name: student.nameWithGroup,
            }))
          );
        }
      }, 1000);

      setTimer(timeoutId);
    }
  }, [searchText]);

  const dropdownVariants = {
    open: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
    closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
  };

  const toggleDropdownHandler = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const searchInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!startTyping) {
      setStartTyping(true);
    }
    setSearchText(e.target.value);
  };

  const addSelectedItem = (id: number) => {
    const selectedItem = students.find((student) => student.id === id);

    if (selectedItem) {
      setSelectedItems([...selectedItems, selectedItem]);
    }

    // if (setErrorMessage) {
    //   setErrorMessage('');
    // }
  };

  const deleteSelectedItem = (id: number) => {
    const newSelectedItems = selectedItems.filter((item) => item.id !== id);
    setSelectedItems(newSelectedItems);
  };

  return (
    <div className="flex flex-col text-lg">
      <div>Список отдельных студентов</div>

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
        <div className="flex items-center w-full px-4 py-3 mt-3 border border-solid bg-another_white rounded-xl border-bright_gray">
          <SearchIcon className="text-gray-500" />
          <input
            value={searchText}
            onChange={searchInputChangeHandler}
            className="w-full pl-4 bg-another_white focus:outline-none"
            placeholder="Поиск"
          />
          <button
            onClick={() => {
              if (!startTyping) {
                setStartTyping(true);
              }
              setSearchText('');
            }}
            type="button"
          >
            <CrossIcon />
          </button>
        </div>

        {startTyping && students.length === 0 ? (
          <div className="mt-3">Ничего не найдено</div>
        ) : (
          <ul
            className={`transition-all mt-3 duration-300 ease-in-out flex flex-col gap-2.5`}
          >
            {students.map((student) => (
              <Checkbox
                key={student.id}
                item={student}
                addSelectedItem={addSelectedItem}
                deleteSelectedItem={deleteSelectedItem}
                isChecked={selectedItems.some(
                  (selectedItem) => selectedItem.id === student.id
                )}
              />
            ))}
          </ul>
        )}
      </motion.div>

      <div className="flex flex-wrap gap-2 mx-3 mt-3">
        {selectedItems.map((selectedItem) => (
          <Chip
            key={selectedItem.id}
            label={selectedItem.name}
            size={'small'}
          />
        ))}
      </div>
    </div>
  );
};

export default SpecificStudentsInput;
