import { FC, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

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
  const publicRoutes = ['/sign-in'];
  const requiredAuth = !publicRoutes.includes(location.pathname);

  const [chooseRoleModal, setChooseRoleModal] = useState<{
    status: boolean;
    tempUser: IUser | null;
  }>({ status: false, tempUser: null });

  useEffect(() => {
    if (requiredAuth) {
      fetchCurrentUserInfo();
    } else {
      if (Cookies.get('refresh')) {
        fetchCurrentUserInfo();
      }
    }
  }, []);

  const fetchCurrentUserInfo = async () => {
    const { data: userData } = await getUser();

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
  };

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
      localStorage.setItem('currentRole', newRole.name);
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
