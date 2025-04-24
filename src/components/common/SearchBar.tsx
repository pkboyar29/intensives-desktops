import { FC } from 'react';
import SearchIcon from '../icons/SearchIcon';

interface SearchBarProps {
  searchText: string;
  searchInputChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: FC<SearchBarProps> = ({
  searchText,
  searchInputChangeHandler,
}) => {
  return (
    <div className="flex items-center w-full px-4 py-3 mt-3 bg-another_white rounded-xl">
      <SearchIcon className="text-gray-500" />
      <input
        value={searchText}
        onChange={searchInputChangeHandler}
        className="w-full pl-4 bg-another_white focus:outline-none"
        placeholder="Поиск"
      />
    </div>
  );
};

export default SearchBar;
