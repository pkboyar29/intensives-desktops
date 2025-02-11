import { FC, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { useLazyGetUserQuery } from '../redux/api/userApi';
import { useAppDispatch } from '../redux/store';
import { setCurrentUser } from '../redux/slices/userSlice';

import Header from '../components/Header';
import routeConfig from '../router/routeConfig';
import { UserRole } from '../ts/interfaces/IUser';

const App: FC = () => {
  const [getUser] = useLazyGetUserQuery();
  const dispatch = useAppDispatch();

  const location = useLocation();
  const nonRequiredAuthRoutes = ['/sign-in', '/not-found'];
  const requiredAuth = !nonRequiredAuthRoutes.includes(location.pathname);

  useEffect(() => {
    const fetchCurrentUserInfo = async () => {
      if (requiredAuth) {
        const { data: currentUser } = await getUser();

        // TODO: валидация currentRole (его спокойно могут изменить или стереть или убрать весь local storage item)
        // , иначе отображать окно с выбором роли, чтобы снова заполнить currentRole
        const currentRole = localStorage.getItem('currentRole');
        if (currentUser && currentRole) {
          dispatch(
            setCurrentUser({
              ...currentUser,
              currentRole: currentRole as UserRole,
            })
          );
        }
      }
    };
    fetchCurrentUserInfo();
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
