import { FC, useState, useRef, useEffect } from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterProps {
  filterList: FilterOption[];
  activeFilterOption: string;
  onFilterOptionClick: (filterOption: string) => void;
}

const Filter: FC<FilterProps> = ({
  filterList,
  activeFilterOption,
  onFilterOptionClick,
}) => {
  const [activeOptionWidth, setActiveOptionWidth] = useState<number>(0);
  const [activeOptionOffset, setActiveOptionOffset] = useState<number>(0);
  const filterRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = filterList.findIndex(
      (filterOption) => filterOption.value === activeFilterOption
    );

    if (activeIndex !== -1 && filterRefs.current[activeIndex]) {
      const activeRef = filterRefs.current[activeIndex];
      setActiveOptionWidth(activeRef.offsetWidth);
      setActiveOptionOffset(activeRef.offsetLeft);
    }
  }, [activeFilterOption]);

  return (
    <div className="relative inline-flex gap-8 pb-2 border-b border-black border-solid">
      <div
        className={`absolute -bottom-[2px] h-[3px] rounded-lg bg-blue transition-all duration-300 ease-in-out`}
        style={{
          width: `${activeOptionWidth}px`,
          left: `${activeOptionOffset}px`,
        }}
      />

      {filterList.map((filterOption, index) => (
        <div
          ref={(el) => (filterRefs.current[index] = el)}
          onClick={() => onFilterOptionClick(filterOption.value)}
          className={`text-base transition duration-300 ease-in-out cursor-pointer hover:text-blue ${
            activeFilterOption === filterOption.value && 'text-blue'
          }`}
        >
          {filterOption.label}
        </div>
      ))}
    </div>
  );
};

export default Filter;
