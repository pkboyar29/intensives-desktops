import { FC, ReactNode, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import ChevronLeftIcon from '../icons/ChevronLeftIcon';
import ChevronRightIcon from '../icons/ChevronRightIcon';

interface SidebarProps {
  children: ReactNode;
}

const Sidebar: FC<SidebarProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  return (
    <motion.div
      animate={{
        left: isOpen ? 0 : isMobile ? -240 : -220,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`top-0 left-0 h-full w-[300px] p-5 bg-white border-r border-solid shadow-md border-r-gray ${
        isMobile ? `absolute pt-[88px] z-50` : 'relative'
      }`}
    >
      <div
        className={`overflow-hidden transition duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {children}
      </div>

      {isMobile && (
        <button
          className="absolute bottom-5 right-2 md:right-5 w-12 h-12 flex items-center justify-center rounded-[10px] bg-gray_5 transition duration-300 hover:bg-gray_6"
          onClick={() => setIsOpen((isOpen) => !isOpen)}
        >
          {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </button>
      )}
    </motion.div>
  );
};

export default Sidebar;
