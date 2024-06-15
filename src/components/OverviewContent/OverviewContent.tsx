import { FC, ReactNode } from 'react'

interface OverviewContentProps {
   children: ReactNode
}

const OverviewContent: FC<OverviewContentProps> = ({ children }) => {
   return (
      <div className='flex flex-col gap-5 mt-1'>
         {children}
      </div>
   )
}

export default OverviewContent