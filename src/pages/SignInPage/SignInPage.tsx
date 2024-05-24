import { FC, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import Cookies from 'js-cookie'

import './SignInPage.css'
import { CurrentUserContext } from '../../context/CurrentUserContext'

interface SignInProps {
   email: string,
   password: string
}

const SignInPage: FC = () => {

   const { updateCurrentUser } = useContext(CurrentUserContext)

   const navigate = useNavigate()

   const { handleSubmit, register } = useForm<SignInProps>({
      mode: "onBlur"
   })

   const onSubmit = (data: SignInProps) => {
      console.log(data)
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/token/`, data)
         .then(response => {
            console.log(response.data)
            Cookies.set('refresh', response.data.refresh)
            Cookies.set('access', response.data.access)
            updateCurrentUser(response.data.access)
            navigate('/intensives')
         })
         .catch(error => console.log(error.response.data))
   }

   return (
      <>
         <div className='sign-in'>
            <form onSubmit={handleSubmit(onSubmit)} className='sign-in__form'>
               <div className="form__title">Войти в систему</div>
               <input {...register('email')} className='sign-in__input' type='text' placeholder='Email' />
               <input {...register('password')} className='sign-in__input' type='password' placeholder='Пароль' />
               <button className='sign-in__button' type='submit'>ВОЙТИ</button>
            </form>
         </div>
      </>
   )
}

export default SignInPage