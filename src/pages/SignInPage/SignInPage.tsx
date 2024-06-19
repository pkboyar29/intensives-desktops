import { FC, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import Cookies from 'js-cookie'

import { CurrentUserContext } from '../../context/CurrentUserContext'
import { TeamsContext } from '../../context/TeamsContext'
import { User } from '../../utils/types/User'
import { Team } from '../../utils/types/Team'

interface SignInProps {
   email: string,
   password: string
}

const SignInPage: FC = () => {
   const { currentUser, updateCurrentUser } = useContext(CurrentUserContext)
   const { getCurrentTeamForStudent } = useContext(TeamsContext)
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

   const onSubmit = async (data: SignInProps) => {
      console.log(data)
      try {
         const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/token/`, data)
         console.log(response.data)
         Cookies.set('refresh', response.data.refresh)
         Cookies.set('access', response.data.access)

         const currentUserInfo: User = await updateCurrentUser()
         if (currentUserInfo.user_role_id === 1) {
            if (currentUserInfo.student_id) {
               const currentTeam: Promise<Team> = getCurrentTeamForStudent(currentUserInfo.student_id)
               const currentTeamId = (await currentTeam).id
               navigate(`/student/${currentTeamId}/overview`)
            }
         } else if (currentUserInfo.user_role_id === 3) {
            navigate('/intensives')
         }
      } catch (error) {
         console.log(error)
      }
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