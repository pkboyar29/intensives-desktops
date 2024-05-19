import { FC } from 'react'
import { Outlet } from 'react-router-dom'

import './IntensivePage'

const IntensivePage: FC = () => {
   return (
      <>
         Hello world
         <Outlet />
      </>
   )
}

export default IntensivePage