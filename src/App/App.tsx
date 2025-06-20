import { FC, useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ToastContainer } from 'react-toastify';
import { RouteType } from '../router/routeConfig';

import { IUser, UserRole } from '../ts/interfaces/IUser';
import { useLazyGetUserQuery } from '../redux/api/userApi';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { setCurrentUser } from '../redux/slices/userSlice';
import { redirectByRole } from '../helpers/urlHelpers';

import ChoosingRoleComponent from '../components/ChoosingRoleComponent';
import Modal from '../components/common/modals/Modal';
import Header from '../components/Header';
import SignInPage from '../pages/SignInPage';
import NotFoundPage from '../pages/NotFoundPage';
import routeConfig from '../router/routeConfig';
import ProtectedRoute from '../router/ProtectedRoute';

const App: FC = () => {
  const currentUser = useAppSelector((state) => state.user.data);
  const [getUser] = useLazyGetUserQuery();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const location = useLocation();
  const publicRoutes = ['/sign-in'];
  const requiredAuth = !publicRoutes.includes(location.pathname);

  const [chooseRoleModal, setChooseRoleModal] = useState<{
    status: boolean;
    tempUser: IUser | null;
  }>({ status: false, tempUser: null });

  useEffect(() => {
    if (requiredAuth) {
      fetchCurrentUserInfo();
    }

    // в SignInPage
    if (!requiredAuth && Cookies.get('refresh')) {
      fetchCurrentUserInfo();
    }
  }, []);

  const setCurrentRoleAndRedirect = (user: IUser, role: UserRole) => {
    dispatch(
      setCurrentUser({
        ...user,
        currentRole: role,
      })
    );
    setIsLoading(false);
    localStorage.setItem('currentRole', role.name);
    redirectByRole(role);
  };

  const fetchCurrentUserInfo = async () => {
    setIsLoading(true);
    const { data: userData, error } = await getUser();

    if (error) {
      setIsLoading(false);
      return;
    }

    if (userData) {
      const userRoles: UserRole[] = userData.roles.some(
        (role) => role.name === 'Student'
      )
        ? [...userData.roles, { name: 'Mentor', displayName: 'Наставник' }]
        : userData.roles;

      const currentRoleName: string | null =
        localStorage.getItem('currentRole');
      const currentRole = userRoles.find(
        (userRole) => userRole.name === currentRoleName
      );

      if (currentRole) {
        dispatch(
          setCurrentUser({
            ...userData,
            roles: userRoles,
            currentRole,
          })
        );
        setIsLoading(false);
      } else {
        if (userRoles.length == 1) {
          setCurrentRoleAndRedirect(userData, userRoles[0]);
          return;
        }

        setChooseRoleModal({
          status: true,
          tempUser: {
            ...userData,
            roles: userRoles,
          },
        });
      }
    }
  };

  const disableChooseRoleModal = () => {
    setChooseRoleModal({ status: false, tempUser: null });
  };

  const onContinueButtonClick = (newRole: UserRole) => {
    if (chooseRoleModal.tempUser) {
      setCurrentRoleAndRedirect(chooseRoleModal.tempUser, newRole);

      disableChooseRoleModal();
    }
  };

  const ChoosingRoleModal: FC = () => {
    return (
      <>
        {chooseRoleModal.status && chooseRoleModal.tempUser && (
          <Modal
            title="Выбор роли пользователя"
            onCloseModal={() => {}}
            shouldHaveCrossIcon={false}
          >
            <ChoosingRoleComponent
              rolesToChoose={chooseRoleModal.tempUser.roles}
              onContinueButtonClick={onContinueButtonClick}
            />
          </Modal>
        )}
      </>
    );
  };

  // показываем пустоту, если еще идет загрузка текущего пользователя в SignInPage
  if (isLoading && !requiredAuth) {
    return (
      <>
        <ChoosingRoleModal />
      </>
    );
  }

  return (
    <>
      <ChoosingRoleModal />

      <div className="App">
        <ToastContainer position="top-center" limit={3} />

        {currentUser && currentUser.currentRole && <Header />}

        {/* TODO: избавиться от двух предупреждений при первом рендере (они появляются из-за того, что последний роут в routeConfig появляется только когда роуты загружается текущий пользоватлеь) */}

        <Routes>
          {currentUser &&
            currentUser.currentRole &&
            routeConfig.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={
                  <ProtectedRoute resolvedRoles={route.resolvedRoles}>
                    {route.element}
                  </ProtectedRoute>
                }
              >
                {route.children?.map((childRoute, index) => (
                  <Route
                    key={index}
                    path={childRoute.path}
                    element={
                      <ProtectedRoute
                        resolvedRoles={(childRoute as RouteType).resolvedRoles}
                      >
                        {childRoute.element}
                      </ProtectedRoute>
                    }
                  />
                ))}
              </Route>
            ))}

          <Route path="/sign-in" element={<SignInPage />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
