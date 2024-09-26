import { FC, ReactNode } from 'react';

import EventsProvider from '../context/EventsContext';
import CurrentUserProvider from '../context/CurrentUserContext';
import TeamsProvider from '../context/TeamsContext';

import { Provider } from 'react-redux';
import { store } from '../redux/store';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders: FC<AppProvidersProps> = ({ children }) => {
  return (
    <CurrentUserProvider>
      <TeamsProvider>
        <EventsProvider>
          <Provider store={store}>
            <DndProvider backend={HTML5Backend}>{children}</DndProvider>/
          </Provider>
        </EventsProvider>
      </TeamsProvider>
    </CurrentUserProvider>
  );
};

export default AppProviders;
