import { useRef } from 'react';
import Chip from './Chip';

interface ChipListProps<T> {
  title?: string;
  items: T[];
  chipSize: 'big' | 'small';
  chipClickHandler?: () => void;
  chipCrossIcon?: boolean;
  chipDeleteHandler?: (itemId: number) => void;
}

const ChipList = <T extends { id: number; name: string }>({
  title,
  items,
  chipSize,
  chipClickHandler,
  chipCrossIcon = false,
  chipDeleteHandler,
}: ChipListProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col gap-3">
      {title && <div>{title}</div>}
      <div
        ref={containerRef}
        className={`flex flex-wrap gap-2 md:gap-3 max-h-[90px] overflow-y-auto md:max-h-none md:overflow-visible`}
      >
        {items.map((item) => (
          <Chip
            key={item.id}
            label={item.name}
            size={chipSize}
            clickHandler={chipClickHandler}
            shouldHaveCrossIcon={chipCrossIcon}
            deleteHandler={() =>
              chipDeleteHandler && chipDeleteHandler(item.id)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ChipList;
