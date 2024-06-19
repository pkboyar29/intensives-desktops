import { FC } from 'react'

interface OverviewItemProps {
   title: string,
   value: string | undefined
}

const OverviewItem: FC<OverviewItemProps> = ({ title, value }) => {
   return (
      <>
         <div>
            <h2 className='text-black text-xl font-bold font-sans'>{title}</h2>
            <div className='text-bright_gray text-base font-sans mt-2'>{value}</div>
         </div>
      </>
   )
}

export default OverviewItem