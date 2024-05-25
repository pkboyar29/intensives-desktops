import { FC, ReactNode } from 'react'

import { educationRequests } from '../data/educationRequests'

import IntensivesProvider from '../context/IntensivesContext'
import EducationRequestsProvider from '../context/EducationRequestsContext'
import EventsProvider from '../context/EventsContext'
import CurrentUserProvider from '../context/CurrentUserContext'
import TeamsProvider from '../context/TeamsContext'

interface AppProvidersProps {
   children: ReactNode
}

const AppProviders: FC<AppProvidersProps> = ({ children }) => {

   return (
      <CurrentUserProvider>
         <IntensivesProvider>
            <TeamsProvider>
               <EducationRequestsProvider educationRequests={educationRequests}>
                  <EventsProvider>
                     {children}
                  </EventsProvider>
               </EducationRequestsProvider>
            </TeamsProvider>
         </IntensivesProvider>
      </CurrentUserProvider>
   )
}

export default AppProviders