import { FC, ReactNode } from 'react'

import { intensives } from '../data/intensives'
import { educationRequests } from '../data/educationRequests'

import IntensivesProvider from '../context/IntensivesContext'
import EducationRequestsProvider from '../context/EducationRequestsContext'

interface AppProvidersProps {
   children: ReactNode
}

const AppProviders: FC<AppProvidersProps> = ({ children }) => {
   return (
      <IntensivesProvider intensives={intensives}>
         <EducationRequestsProvider educationRequests={educationRequests}>
            {children}
         </EducationRequestsProvider>
      </IntensivesProvider>
   )
}

export default AppProviders