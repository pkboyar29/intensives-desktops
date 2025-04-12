import { useRef } from 'react';
import Chip from './Chip';

interface ChipListProps<T> {
  title: string;
  items: T[];
  chipSize: 'big' | 'small';
}

const ChipList = <T extends { id: number; name: string }>({
  title,
  items,
  chipSize,
}: ChipListProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col gap-3">
      <div>{title}</div>
      <div
        ref={containerRef}
        className={`flex flex-wrap gap-2 md:gap-3 max-h-[90px] overflow-y-auto md:max-h-none md:overflow-visible`}
      >
        {items.map((item) => (
          <Chip key={item.id} label={item.name} size={chipSize} />
        ))}
      </div>
    </div>
  );
};

export default ChipList;
