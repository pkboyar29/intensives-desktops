import { FC, ReactNode } from 'react'

import { educationRequests } from '../data/educationRequests'
import { events } from '../data/events'

import IntensivesProvider from '../context/IntensivesContext'
import EducationRequestsProvider from '../context/EducationRequestsContext'
import EventsProvider from '../context/EventsContext'
import CurrentUserProvider from '../context/CurrentUserContext'

interface AppProvidersProps {
   children: ReactNode
}

const AppProviders: FC<AppProvidersProps> = ({ children }) => {

   return (
      <CurrentUserProvider>
         <IntensivesProvider>
            <EducationRequestsProvider educationRequests={educationRequests}>
               <EventsProvider events={events}>
                  {children}
               </EventsProvider>
            </EducationRequestsProvider>
         </IntensivesProvider>
      </CurrentUserProvider>
   )
}

export default AppProviders