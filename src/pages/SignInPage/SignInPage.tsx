import './SignInPage.css'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

const SignInPage: FC = () => {

   const navigate = useNavigate()

   return (
      <>
         <div className='sign-in'>
            <form className='sign-in__form'>
               <div className="form__title">Войти в систему</div>
               <input className='sign-in__input' type='text' placeholder='Логин' />
               <input className='sign-in__input' type='password' placeholder='Пароль' />
               <button onClick={() => navigate('/intensives')} className='sign-in__button' type='submit'>ВОЙТИ</button>
            </form>
         </div>
      </>
   )
}

export default SignInPage