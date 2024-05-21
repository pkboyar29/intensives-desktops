import { FC, ReactNode } from 'react'
import './Sidebar.css'

interface SidebarProps {
   children: ReactNode
}

const Sidebar: FC<SidebarProps> = ({ children }) => {
   return (
      <div className='sidebar'>
         <ul className='sidebar__links'>
            {children}
         </ul>
      </div>
   )
}

export default Sidebar