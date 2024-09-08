import { FC, ReactNode } from 'react';

import { educationRequests } from '../data/educationRequests';

import IntensivesProvider from '../context/IntensivesContext';
import EducationRequestsProvider from '../context/EducationRequestsContext';
import EventsProvider from '../context/EventsContext';
import CurrentUserProvider from '../context/CurrentUserContext';
import TeamsProvider from '../context/TeamsContext';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders: FC<AppProvidersProps> = ({ children }) => {
  return (
    <CurrentUserProvider>
      <IntensivesProvider>
        <TeamsProvider>
          <EducationRequestsProvider educationRequests={educationRequests}>
            <EventsProvider>
              <DndProvider backend={HTML5Backend}>{children}</DndProvider>/
            </EventsProvider>
          </EducationRequestsProvider>
        </TeamsProvider>
      </IntensivesProvider>
    </CurrentUserProvider>
  );
};

export default AppProviders;
