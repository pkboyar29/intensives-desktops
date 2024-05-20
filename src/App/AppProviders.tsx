import { FC, ReactNode } from 'react'

import { intensives } from '../data/intensives'
import { educationRequests } from '../data/educationRequests'
import { events } from '../data/events'

import IntensivesProvider from '../context/IntensivesContext'
import EducationRequestsProvider from '../context/EducationRequestsContext'
import EventsProvider from '../context/EventsContext'

interface AppProvidersProps {
   children: ReactNode
}

const AppProviders: FC<AppProvidersProps> = ({ children }) => {
   return (
      <IntensivesProvider intensives={intensives}>
         <EducationRequestsProvider educationRequests={educationRequests}>
            <EventsProvider events={events}>
               {children}
            </EventsProvider>
         </EducationRequestsProvider>
      </IntensivesProvider>
   )
}

export default AppProviders