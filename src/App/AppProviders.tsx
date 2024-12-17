import { FC, ReactNode } from 'react';

import { Provider } from 'react-redux';
import { store } from '../redux/store';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders: FC<AppProvidersProps> = ({ children }) => {
  return (
          <Provider store={store}>
            <DndProvider backend={HTML5Backend}>{children}</DndProvider>
          </Provider>
  );
};

export default AppProviders;
