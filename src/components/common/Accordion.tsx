import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AccordionProps<T> {
  items: T[];
  expandedItemId: number | null;
  onItemClick: (item: number | null) => void;
  expandedContent: ReactNode | null;
}

const Accordion = <T extends { id: number; name: string }>({
  items,
  expandedItemId,
  onItemClick,
  expandedContent,
}: AccordionProps<T>) => {
  return (
    <div className="flex flex-col gap-2 p-2 bg-white rounded-lg shadow-md sm:p-3 md:p-4 max-w">
      {items.map((item) => (
        <div className={`p-1 sm:p-4 rounded-lg shadow-sm`} key={item.id}>
          <button
            className={`w-full cursor-pointer select-none text-left text-lg font-medium transition duration-300 ease-in-out hover:text-blue py-1.5 ${
              expandedItemId && item.id === expandedItemId && 'text-blue'
            }`}
            onClick={() => {
              if (expandedItemId && item.id === expandedItemId) {
                onItemClick(null);
              } else {
                onItemClick(item.id);
              }
            }}
          >
            {item.name}
          </button>

          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={
              expandedItemId && expandedItemId === item.id
                ? { opacity: 1, height: 'auto', scale: 1 }
                : {}
            }
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            {expandedContent}
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
