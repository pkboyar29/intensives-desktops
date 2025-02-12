import { FC, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { resetUserState, setCurrentRole } from '../redux/slices/userSlice';
import { resetIntensiveState } from '../redux/slices/intensiveSlice';
import { resetTeamState } from '../redux/slices/teamSlice';

import PrimaryButton from './common/PrimaryButton';
import Modal from './common/modals/Modal';
import UserIcon from './icons/UserIcon';
import SettingsIcon from './icons/SettingsIcon';
import LogoutIcon from './icons/LogoutIcon';

import Cookies from 'js-cookie';
import { UserRole } from '../ts/interfaces/IUser';
import { redirectByRole } from '../helpers/urlHelpers';

const Header: FC = () => {
  const navigate = useNavigate();
  const [logOutModal, setLogOutModal] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [changeRoleModal, setChangeRoleModal] = useState<{
    status: boolean;
    role: UserRole | null;
  }>({ status: false, role: null });

  const currentUser = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const logOut = () => {
    localStorage.removeItem('currentRole');
    Cookies.remove('access');
    Cookies.remove('refresh');

    dispatch(resetUserState());
    dispatch(resetIntensiveState());
    dispatch(resetTeamState());

    setLogOutModal(false);

    navigate('/sign-in');
  };

  const changeRole = (role: UserRole) => {
    dispatch(setCurrentRole(role));
    localStorage.setItem('currentRole', role);
    redirectByRole(role);
  };

  const disableChangeRoleModal = () => {
    setChangeRoleModal({ status: false, role: null });
  };

  return (
    <>
      {logOutModal && (
        <Modal
          title="Выход из системы"
          onCloseModal={() => setLogOutModal(false)}
        >
          <p className="text-lg text-bright_gray">
            {`Вы уверены, что хотите выйти из системы?`}
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <div>
              <PrimaryButton
                buttonColor="gray"
                clickHandler={() => setLogOutModal(false)}
                children="Отмена"
              />
            </div>
            <div>
              <PrimaryButton clickHandler={logOut} children="Выйти" />
            </div>
          </div>
        </Modal>
      )}

      {changeRoleModal.status && (
        <Modal
          title="Смена роли пользователя"
          onCloseModal={disableChangeRoleModal}
        >
          <p className="text-lg text-bright_gray">
            Текущая роль:{' '}
            <span className="font-bold text-black">
              {currentUser?.currentRole}
            </span>
            . Роль будет сменена на:{' '}
            <span className="font-bold text-black">{changeRoleModal.role}</span>
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <div>
              <PrimaryButton
                buttonColor="gray"
                clickHandler={disableChangeRoleModal}
                children="Отмена"
              />
            </div>
            <div>
              <PrimaryButton
                clickHandler={() => {
                  if (changeRoleModal.role) {
                    changeRole(changeRoleModal.role);
                  }
                  disableChangeRoleModal();
                }}
                children="Сменить роль"
              />
            </div>
          </div>
        </Modal>
      )}

      <header
        className={`${
          currentUser && currentUser.currentRole ? `sticky` : `hidden`
        } top-0 z-[100] px-10 py-4 border-b border-solid bg-white border-gray`}
      >
        <div className="container relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="font-sans text-2xl font-bold">LOGO</div>
              <div className="font-sans text-base">
                Костромской государственный университет
              </div>
            </div>
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setIsOpen((isOpen) => !isOpen)}
                  className="p-4 transition duration-300 ease-in-out rounded-xl bg-another_white hover:bg-black_gray"
                >
                  <UserIcon />
                </button>

                <div
                  ref={menuRef}
                  className={`absolute z-50 w-52 top-11 right-0 mt-2 bg-another_white rounded-xl shadow-lg p-4 ${
                    isOpen ? 'block' : 'hidden'
                  }`}
                >
                  <div className="flex flex-col items-start gap-2">
                    <div className="text-base font-bold">{`${currentUser.firstName} ${currentUser.lastName} ${currentUser.patronymic}`}</div>

                    <div className="w-full border-b border-solid border-black_gray"></div>

                    <div className="text-lg">Доступные роли</div>
                    <div className="flex flex-col w-full gap-4">
                      {currentUser.roles.map((role, index) => (
                        <div
                          key={index}
                          className={`font-bold cursor-pointer transition duration-300 ease-in-out hover:text-blue ${
                            currentUser.currentRole === role && 'text-blue'
                          }`}
                          onClick={() => {
                            if (currentUser.currentRole !== role) {
                              if (isOpen) {
                                setIsOpen(false);
                              }
                              setChangeRoleModal({ status: true, role });
                            }
                          }}
                        >
                          {role}
                        </div>
                      ))}
                    </div>

                    <div className="w-full border-b border-solid border-black_gray"></div>

                    <button
                      className="flex items-center w-full gap-3 p-2 text-base text-left transition duration-300 ease-in-out rounded-lg hover:bg-black_gray"
                      onClick={() => console.log('переход в настройки')}
                    >
                      <SettingsIcon className="w-5 h-5" />
                      <span className="inline-flex items-center">
                        Настройки
                      </span>
                    </button>
                    <button
                      className="flex items-center w-full gap-3 p-2 text-base text-left transition duration-300 ease-in-out rounded-lg hover:bg-black_gray"
                      onClick={() => {
                        setIsOpen(false);
                        setLogOutModal(true);
                      }}
                    >
                      <LogoutIcon className="w-5 h-5" />
                      <span className="inline-flex items-center">Выйти</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
