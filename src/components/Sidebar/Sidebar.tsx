import { FC, ReactNode } from 'react';

interface SidebarProps {
  children: ReactNode;
}

const Sidebar: FC<SidebarProps> = ({ children }) => {
  return (
    <div className="h-full p-5 border-r border-solid w-80 border-r-gray">
      <ul className="flex flex-col gap-5 text-left">{children}</ul>
    </div>
  );
};

export default Sidebar;
