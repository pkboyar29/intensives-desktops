import { FC } from 'react';
import SearchIcon from '../icons/SearchIcon';
import CrossIcon from '../icons/CrossIcon';

interface SearchBarProps {
  className?: string;
  searchText: string;
  searchInputChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  crossIconClickHandler?: () => void;
}

const SearchBar: FC<SearchBarProps> = ({
  className,
  searchText,
  searchInputChangeHandler,
  crossIconClickHandler,
}) => {
  return (
    <div
      className={`flex items-center w-full px-4 py-3 mt-3 bg-another_white rounded-xl ${className}`}
    >
      <SearchIcon className="text-gray-500" />
      <input
        value={searchText}
        onChange={searchInputChangeHandler}
        className="w-full pl-4 bg-another_white focus:outline-none"
        placeholder="Поиск"
        maxLength={100}
      />
      {crossIconClickHandler && (
        <button onClick={crossIconClickHandler} type="button">
          <CrossIcon />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
