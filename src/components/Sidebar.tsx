import { FC, ReactNode } from 'react';

interface SidebarProps {
  children: ReactNode;
}

const Sidebar: FC<SidebarProps> = ({ children }) => {
  return (
    // w-80
    <div className="w-auto h-full p-5 border-r border-solid border-r-gray">
      <ul className="flex flex-col gap-5 text-left">{children}</ul>
    </div>
  );
};

export default Sidebar;
