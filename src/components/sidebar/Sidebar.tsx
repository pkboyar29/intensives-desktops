import { FC, ReactNode } from 'react';

interface SidebarProps {
  children: ReactNode;
}

const Sidebar: FC<SidebarProps> = ({ children }) => {
  return (
    <div className="w-[325px] px-5 pt-5 border-r border-solid border-r-gray">
      {children}
    </div>
  );
};

export default Sidebar;
