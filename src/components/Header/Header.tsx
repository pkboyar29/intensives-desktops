import { FC, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { CurrentUserContext } from '../../context/CurrentUserContext';

const Header: FC = () => {
  const navigate = useNavigate();

  const { currentUser, logOut } = useContext(CurrentUserContext);

  const onButtonClick = () => {
    logOut();
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
              <div>
                {`${currentUser?.first_name}  ${currentUser?.last_name}`}
              </div>
              <button
                onClick={onButtonClick}
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
