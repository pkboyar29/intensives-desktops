import { FC, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { IUser, UserRole } from '../ts/interfaces/IUser';
import { useLazyGetUserQuery } from '../redux/api/userApi';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { setCurrentUser } from '../redux/slices/userSlice';
import { redirectByRole } from '../helpers/urlHelpers';

import ChoosingRoleComponent from '../components/ChoosingRoleComponent';
import Modal from '../components/common/modals/Modal';
import Header from '../components/Header';
import routeConfig from '../router/routeConfig';

const App: FC = () => {
  const currentUser = useAppSelector((state) => state.user.data);
  const [getUser] = useLazyGetUserQuery();
  const dispatch = useAppDispatch();

  const location = useLocation();
  const nonRequiredAuthRoutes = ['/sign-in', '/not-found'];
  const requiredAuth = !nonRequiredAuthRoutes.includes(location.pathname);

  const [chooseRoleModal, setChooseRoleModal] = useState<{
    status: boolean;
    tempUser: IUser | null;
  }>({ status: false, tempUser: null });

  useEffect(() => {
    const fetchCurrentUserInfo = async () => {
      if (requiredAuth) {
        const { data: userData } = await getUser();

        const currentRole = localStorage.getItem('currentRole');
        if (userData) {
          const userRoles: UserRole[] = userData.roles.includes('Студент')
            ? [...userData.roles, 'Наставник']
            : userData.roles;

          const validUserRoles: UserRole[] = [
            'Администратор',
            'Организатор',
            'Преподаватель',
            'Студент',
            'Наставник',
          ];
          if (currentRole && validUserRoles.includes(currentRole as UserRole)) {
            dispatch(
              setCurrentUser({
                ...userData,
                roles: userRoles,
                currentRole: currentRole as UserRole,
              })
            );
          } else {
            setChooseRoleModal({
              status: true,
              tempUser: {
                ...userData,
                roles: userRoles,
              },
            });
          }
        }
      }
    };

    fetchCurrentUserInfo();
  }, []);

  const disableChooseRoleModal = () => {
    setChooseRoleModal({ status: false, tempUser: null });
  };

  const onContinueButtonClick = (newRole: UserRole) => {
    if (chooseRoleModal.tempUser) {
      dispatch(
        setCurrentUser({
          ...chooseRoleModal.tempUser,
          currentRole: newRole,
        })
      );
      localStorage.setItem('currentRole', newRole);
      redirectByRole(newRole);

      disableChooseRoleModal();
    }
  };

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

      <div className="App">
        {currentUser && currentUser.currentRole && <Header />}

        <Routes>
          {routeConfig.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
              {route.children?.map((childRoute, index) => (
                <Route
                  key={index}
                  path={childRoute.path}
                  element={childRoute.element}
                />
              ))}
            </Route>
          ))}
        </Routes>
      </div>
    </>
  );
};

export default App;
