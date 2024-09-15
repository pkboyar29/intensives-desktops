import { FC, useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CurrentUserContext } from '../context/CurrentUserContext';

import Header from '../components/Header';
import routeConfig from '../router/routeConfig';

const App: FC = () => {
  const { updateCurrentUser } = useContext(CurrentUserContext);

  useEffect(() => {
    updateCurrentUser();
  }, []);

  return (
    <div className="App">
      <Header />

      <Routes>
        {routeConfig.map((route) => (
          <Route key={route.id} path={route.path} element={route.element}>
            {route.children?.map((childRoute) => (
              <Route path={childRoute.path} element={childRoute.element} />
            ))}
          </Route>
        ))}
      </Routes>
    </div>
  );
};

export default App;
