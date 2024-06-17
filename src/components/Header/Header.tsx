import { FC, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { CurrentUserContext } from '../../context/CurrentUserContext'

const Header: FC = () => {

   const navigate = useNavigate()

   const { currentUser, logOut } = useContext(CurrentUserContext)

   const onButtonClick = () => {
      logOut()
      navigate('/sign-in')
   }

   return (
      <header className='px-10 py-4 border border-solid border-gray'>
         <div className="container">
            <div className=" flex justify-between items-center">
               <div className='font-sans font-bold text-2xl'>LOGO</div>
               {currentUser && (
                  <div className='flex gap-6 items-center text-lg font-sans'>
                     <div>
                        {`${currentUser?.first_name}  ${currentUser?.last_name}`}
                     </div>
                     <button onClick={onButtonClick} className='rounded-xl px-5 py-2 bg-blue text-white text-base font-bold'>Выйти</button>
                  </div>
               )}
            </div>
         </div>
      </header>
   )
}

export default Header