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

   const updateCurrentUser = (): void => {

      const token = Cookies.get('access')

      if (token) {
         const decodedJwt = jwtDecode<CustomJwtPayload>(token)
         const currentUserId = decodedJwt.user_id

         axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${currentUserId}`)
            .then(response => {
               setCurrentUser({
                  id: response.data.id,
                  first_name: response.data.first_name,
                  last_name: response.data.last_name,
                  middle_name: response.data.middle_name,
                  email: response.data.email,
                  user_role_id: response.data.role.id
               })
            })
            .catch(error => console.log(error.response.data))
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