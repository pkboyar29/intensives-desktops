import { FC, ReactNode } from 'react'

interface SidebarProps {
   children: ReactNode
}

const Sidebar: FC<SidebarProps> = ({ children }) => {
   return (
      <div className='w-80 h-full p-5 border-r border-r-gray border-solid'>
         <ul className='flex flex-col gap-5 text-left'>
            {children}
         </ul>
      </div>
   )
}

export default Sidebar