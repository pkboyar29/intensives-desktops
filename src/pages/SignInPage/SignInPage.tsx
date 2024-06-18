import { FC, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import Cookies from 'js-cookie'

import { CurrentUserContext } from '../../context/CurrentUserContext'

interface SignInProps {
   email: string,
   password: string
}

const SignInPage: FC = () => {
   const { currentUser, updateCurrentUser } = useContext(CurrentUserContext)
   const navigate = useNavigate()

   useEffect(() => {
      console.log('монтирование SignInPage')
      if (currentUser) {
         navigate('/intensives')
      }
   }, [])

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
            updateCurrentUser()
            // если это студент, то мы не сюда перенаправляем
            navigate('/intensives')
         })
         .catch(error => console.log(error.response.data))
   }

   return (
      <>
         <div className='mt-20 flex justify-center'>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 w-[480px]'>
               <div className='text-black font-sans text-[26px] font-bold'>Войти в систему</div>
               <input {...register('email')} className='p-4 rounded-lg text-base font-sans border border-black border-solid' type='text' placeholder='Email' />
               <input {...register('password')} className='p-4 rounded-lg text-base font-sans border border-black border-solid' type='password' placeholder='Пароль' />
               <button className='bg-blue p-4 text-white rounded-lg text-left font-sans' type='submit'>ВОЙТИ</button>
            </form>
         </div>
      </>
   )
}

export default SignInPage