import { FC, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import './Header.css'
import { CurrentUserContext } from '../../context/CurrentUserContext'

const Header: FC = () => {

   const navigate = useNavigate()

   const { currentUser, logOut } = useContext(CurrentUserContext)

   const onButtonClick = () => {
      logOut()
      navigate('/sign-in')
   }

   return (
      <header className='header'>
         <div className="container">
            <div className="header__container">
               <div className='header__logo'>LOGO</div>
               {currentUser && (
                  <div className='header__right'>
                     <div className="header__fio">
                        {`${currentUser?.first_name}  ${currentUser?.last_name}`}
                     </div>
                     <button onClick={onButtonClick} className='header__logout'>Выйти</button>
                  </div>
               )}
            </div>
         </div>
      </header>
   )
}

export default Header