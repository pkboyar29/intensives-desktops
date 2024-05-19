import { FC, ReactNode } from 'react'
import './Sidebar.css'

interface SidebarProps {
   children: ReactNode
}

const Sidebar: FC<SidebarProps> = ({ children }) => {
   return (
      <div className='sidebar'>
         {children}
      </div>
   )
}

export default Sidebar