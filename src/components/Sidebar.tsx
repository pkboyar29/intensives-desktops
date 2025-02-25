import { FC, ReactNode } from 'react';

interface SidebarProps {
  children: ReactNode;
}

const Sidebar: FC<SidebarProps> = ({ children }) => {
  return (
    <div className="sticky top-[74px] w-auto h-screen px-5 pt-5 border-r border-solid border-r-gray">
      {children}
    </div>
  );
};

export default Sidebar;
