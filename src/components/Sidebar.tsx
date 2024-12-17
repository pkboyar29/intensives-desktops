import { FC, ReactNode } from 'react';

interface SidebarProps {
  children: ReactNode;
}

const Sidebar: FC<SidebarProps> = ({ children }) => {
  return (
    // w-80
    <div className="w-auto h-full p-5 border-r border-solid border-r-gray">
      {children}
    </div>
  );
};

export default Sidebar;
