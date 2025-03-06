import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AccordionProps<T> {
  items: T[];
  expandedItemId: number | null;
  onItemClick: (item: number) => void;
  expandedContent: ReactNode | null;
}

const Accordion = <T extends { id: number; name: string }>({
  items,
  expandedItemId,
  onItemClick,
  expandedContent,
}: AccordionProps<T>) => {
  return (
    <div className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-md max-w">
      {items.map((item) => (
        <div
          className={`p-4 rounded-lg shadow-sm`}
          onClick={() => {
            if (expandedItemId) {
              if (item.id !== expandedItemId) {
                onItemClick(item.id);
              }
            } else {
              onItemClick(item.id);
            }
          }}
          key={item.id}
        >
          <div
            className={`cursor-pointer select-none text-lg font-medium transition duration-300 ease-in-out hover:text-blue py-1.5 ${
              expandedItemId && item.id === expandedItemId && 'text-blue'
            }`}
          >
            {item.name}
          </div>

          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={
              expandedItemId && expandedItemId === item.id
                ? { opacity: 1, height: 'auto', scale: 1 }
                : {}
            }
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {expandedContent}
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
