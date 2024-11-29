import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { resetUserState } from '../redux/slices/userSlice';
import { resetIntensiveState } from '../redux/slices/intensiveSlice';

import PrimaryButton from './PrimaryButton';
import Modal from './modals/Modal';

import Cookies from 'js-cookie';

const Header: FC = () => {
  const navigate = useNavigate();
  const [logOutModal, setLogOutModal] = useState<boolean>(false);

  const currentUser = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();

  const logOut = () => {
    Cookies.remove('access');
    Cookies.remove('refresh');

    dispatch(resetUserState());
    dispatch(resetIntensiveState());

    setLogOutModal(false);

    navigate('/sign-in');
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

      <header className="px-10 py-4 border border-solid border-gray">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="font-sans text-2xl font-bold">LOGO</div>
              <div className="font-sans text-base">
                Костромской государственный университет
              </div>
            </div>
            {currentUser && (
              <div className="flex items-center gap-6">
                <div className="font-sans text-lg">{`${currentUser?.firstName} ${currentUser?.lastName}`}</div>
                <div className="w-24">
                  <PrimaryButton
                    children="Выйти"
                    clickHandler={() => setLogOutModal(true)}
                  />
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
