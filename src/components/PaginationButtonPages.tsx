import { FC, useState, useRef, useEffect } from 'react';

interface PaginationButtonPagesProps {
  countPages: number;
  currentPage: number;
  countElements?: number;
  diff?: number;
  onClick: (newOffset: number) => void;
}

const PagionationButtonPages: FC<PaginationButtonPagesProps> = ({
  countPages,
  currentPage,
  countElements,
  diff = 6, // Лучше всегда четное
  onClick,
}) => {
  //const countPages = Math.ceil(count / limit);
  //const currentPage = Math.ceil(offset / limit) + 1;
  const buttonStyle =
    'px-2 py-1 duration-100 rounded-md bg-gray_6 hover:bg-gray_7';
  console.log(countPages, currentPage);

  const centerButtons = () => {
    const buttons = [];

    for (let i = currentPage - diff / 2; i < currentPage + diff / 2 + 1; i++) {
      buttons.push(buttonPageNumber(i));
    }
    return buttons;
  };

  const leftButtons = () => {
    const buttons = [];

    for (let i = 1; i < 1 + diff; i++) {
      buttons.push(buttonPageNumber(i));
    }
    return buttons;
  };

  const rightButtons = () => {
    const buttons = [];

    for (let i = countPages - diff + 1; i <= countPages; i++) {
      buttons.push(buttonPageNumber(i));
    }
    return buttons;
  };

  const buttonPageNumber = (page: number) => {
    return (
      <button
        key={page}
        className={`${buttonStyle} ${
          page === currentPage ? `!bg-blue !hover:bg-dark_blue text-white` : ''
        }`}
        onClick={() => onClick(page)}
      >
        {page}
      </button>
    );
  };

  return (
    <div className="flex items-center space-x-3">
      {currentPage - diff >= 0 && currentPage + diff <= countPages + 1 && (
        <>
          {buttonPageNumber(1)}
          <p>...</p>
          {centerButtons()}
          <p>...</p>
          {buttonPageNumber(countPages)}
        </>
      )}{' '}
      {currentPage - diff < 0 && currentPage + diff < countPages && (
        <>
          {leftButtons()}
          <p>...</p>
          {buttonPageNumber(countPages)}
        </>
      )}
      {currentPage + diff > countPages + 1 && currentPage - diff > 0 && (
        <>
          {buttonPageNumber(1)} <p>...</p> {rightButtons()}
        </>
      )}
      {countElements && (
        <p className="ml-5">{`Всего ${countElements} элементов`}</p>
      )}
    </div>
  );
};

export default PagionationButtonPages;
