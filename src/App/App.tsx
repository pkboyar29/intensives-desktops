import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';

import { useGetUserQuery } from '../redux/api/userApi';

import Header from '../components/Header';
import routeConfig from '../router/routeConfig';

const App: FC = () => {
  useGetUserQuery();

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
