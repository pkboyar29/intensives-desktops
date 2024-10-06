import { FC, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { useLazyGetUserQuery } from '../redux/api/userApi';

import Header from '../components/Header';
import routeConfig from '../router/routeConfig';

const App: FC = () => {
  const [getUser] = useLazyGetUserQuery();

  const location = useLocation();
  const nonRequiredAuthRoutes = ['/sign-in', '/not-found'];
  const requiredAuth = !nonRequiredAuthRoutes.includes(location.pathname);

  useEffect(() => {
    if (requiredAuth) {
      getUser();
    }
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
