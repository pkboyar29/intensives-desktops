import { FC } from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarLinkProps {
  text: string;
  to: string;
}

const SidebarLink: FC<SidebarLinkProps> = ({ text, to }) => {
  return (
    <NavLink
      to={to}
      className="py-2 px-2.5 rounded-xl hover:bg-another_white transition duration-200 ease-in-out sidebar__link"
    >
      {text}
    </NavLink>
  );
};

export default SidebarLink;
