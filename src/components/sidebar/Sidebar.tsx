import { FC, ReactNode, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { motion } from 'framer-motion';
import { useWindowSize } from '../../helpers/useWindowSize';
import { setIsSidebarOpen } from '../../redux/slices/windowSlice';

interface SidebarProps {
  children: ReactNode;
}

const Sidebar: FC<SidebarProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector((state) => state.window.isSidebarOpen);

  const { width: windowWidth } = useWindowSize();

  useEffect(() => {
    if (windowWidth > 768) {
      dispatch(setIsSidebarOpen(true));
    } else {
      dispatch(setIsSidebarOpen(false));
    }
  }, [windowWidth]);

  return (
    <motion.div
      initial={{ left: windowWidth > 768 ? 0 : -300 }}
      animate={{
        left: isSidebarOpen ? 0 : -300,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`top-0 left-0 h-full w-[300px] p-5 bg-white border-r border-solid shadow-md border-r-gray overflow-y-auto ${
        windowWidth < 768 ? `absolute pt-[88px] z-50` : 'relative'
      }`}
    >
      <div
        className={`overflow-hidden transition duration-300 ease-in-out ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default Sidebar;
