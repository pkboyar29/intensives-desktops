import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { resetUserState } from '../redux/slices/userSlice';
import { resetIntensiveState } from '../redux/slices/intensiveSlice';

import Cookies from 'js-cookie';

const Header: FC = () => {
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();

  const logOutClickHandler = () => {
    Cookies.remove('access');
    Cookies.remove('refresh');

    dispatch(resetUserState());
    dispatch(resetIntensiveState());

    navigate('/sign-in');
  };

  return (
    <header className="px-10 py-4 border border-solid border-gray">
      <div className="container">
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-2">
            <div className="font-sans text-2xl font-bold">LOGO</div>
            <div className="font-sans text-base">
              Костромской государственный университет
            </div>
          </div>
          {currentUser && (
            <div className="flex items-center gap-6 font-sans text-lg">
              <div>{`${currentUser?.firstName}  ${currentUser?.lastName}`}</div>
              <button
                onClick={logOutClickHandler}
                className="px-5 py-2 text-base font-bold text-white rounded-xl bg-blue"
              >
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
