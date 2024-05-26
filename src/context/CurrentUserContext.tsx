import { createContext, FC, ReactNode, useState } from 'react'
import { User } from '../utils/types/User'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import Cookies from 'js-cookie'

interface CustomJwtPayload {
   user_id: number
}

interface CurrentUserContextType {
   currentUser: User | null,
   updateCurrentUser: () => void,
   logOut: () => void
}

export const CurrentUserContext = createContext<CurrentUserContextType>({
   currentUser: null,
   updateCurrentUser: () => { },
   logOut: () => { }
})

interface CurrentUserProviderProps {
   children: ReactNode
}

const CurrentUserProvider: FC<CurrentUserProviderProps> = ({ children }) => {

   const [currentUser, setCurrentUser] = useState<User | null>(null)

   const updateCurrentUser = async () => {

      const token = Cookies.get('access')

      if (token) {
         try {
            const decodedJwt = jwtDecode<CustomJwtPayload>(token)
            const currentUserId = decodedJwt.user_id
            const userResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${currentUserId}`)
            
            let teacher_id = null
            if (userResponse.data.role.id === 3) {
               const teachersResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/teachers/`)
               const allTeachers = teachersResponse.data.results
               const ourTeacher = allTeachers.find((teacher: any) => teacher.user.id === userResponse.data.id)
               teacher_id = ourTeacher.id
            }

            setCurrentUser({
               id: userResponse.data.id,
               teacher_id: teacher_id,
               first_name: userResponse.data.first_name,
               last_name: userResponse.data.last_name,
               middle_name: userResponse.data.middle_name,
               email: userResponse.data.email,
               user_role_id: userResponse.data.role.id
            })
         } catch (error) {
            console.log(error)
         }
      }
   }

   const logOut = (): void => {
      setCurrentUser(null)
      Cookies.remove('access')
      Cookies.remove('refresh')
   }

   return (
      <CurrentUserContext.Provider value={{ currentUser, updateCurrentUser, logOut }}> {children} </CurrentUserContext.Provider>
   )
}

export default CurrentUserProvider