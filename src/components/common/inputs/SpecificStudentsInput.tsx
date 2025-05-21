import { useState, useRef, useEffect, FC } from 'react';
import { motion } from 'framer-motion';
import { useLazyGetStudentsQuery } from '../../../redux/api/studentApi';

import Checkbox from './Checkbox';
import ChipList from '../ChipList';
import ChevronDownIcon from '../../icons/ChevronDownIcon';
import SearchBar from '../SearchBar';

interface Item {
  id: number;
  name: string;
}

interface SpecificStudentsInputProps {
  selectedItems: Item[];
  setSelectedItems: (items: Item[]) => void;
  flowsToExclude: number[];
  errorMessage?: string;
  setErrorMessage?: (errorMessage: string) => void;
}

const SpecificStudentsInput: FC<SpecificStudentsInputProps> = ({
  flowsToExclude,
  selectedItems,
  setSelectedItems,
  errorMessage,
  setErrorMessage,
}) => {
  const [getStudents] = useLazyGetStudentsQuery();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [startTyping, setStartTyping] = useState<boolean>(false);

  const [students, setStudents] = useState<Item[]>([]);

  useEffect(() => {
    if (startTyping) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
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

      timerRef.current = timeoutId;
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
        <SearchBar
          className="border border-solid border-bright_gray"
          searchText={searchText}
          searchInputChangeHandler={searchInputChangeHandler}
          crossIconClickHandler={() => {
            if (!startTyping) {
              setStartTyping(true);
            }
            setSearchText('');
          }}
        />

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

      <div className="mt-3">
        <ChipList
          items={selectedItems}
          chipSize="small"
          chipCrossIcon={true}
          chipDeleteHandler={(itemId) => deleteSelectedItem(itemId)}
        />
      </div>

      <div className="mt-3 text-base text-red">{errorMessage}</div>
    </div>
  );
};

export default SpecificStudentsInput;
