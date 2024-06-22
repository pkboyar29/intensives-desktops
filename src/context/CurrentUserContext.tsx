import { createContext, FC, ReactNode, useState } from 'react'
import { User } from '../utils/types/User'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import Cookies from 'js-cookie'
import authHeader from '../utils/getHeaders'

interface CustomJwtPayload {
   user_id: number
}

interface CurrentUserContextType {
   currentUser: User | null,
   updateCurrentUser: () => Promise<User>,
   logOut: () => void
}

export const CurrentUserContext = createContext<CurrentUserContextType>({
   currentUser: null,
   updateCurrentUser: () => Promise.resolve({ id: 0, teacher_id: null, student_id: null, first_name: '', last_name: '', middle_name: '', email: '', user_role_id: 0 }),
   logOut: () => { }
})

interface CurrentUserProviderProps {
   children: ReactNode
}

const CurrentUserProvider: FC<CurrentUserProviderProps> = ({ children }) => {
   const [currentUserInfo, setCurrentUserInfo] = useState<User | null>(null)

   const updateCurrentUserInfo = async (): Promise<User> => {
      const token = Cookies.get('access')

      if (token) {
         try {
            const decodedJwt = jwtDecode<CustomJwtPayload>(token)
            const currentUserId = decodedJwt.user_id
            const userResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${currentUserId}`, { headers: await authHeader() })

            let student_id = null
            if (userResponse.data.role.id === 1) {
               const studentResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/students/`, { headers: await authHeader() })
               const allStudents = studentResponse.data.results
               const ourStudent = allStudents.find((student: any) => student.user.id === userResponse.data.id)
               student_id = ourStudent.id
            }

            let teacher_id = null
            if (userResponse.data.role.id === 3) {
               const teachersResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/teachers/`, { headers: await authHeader() })
               const allTeachers = teachersResponse.data.results
               const ourTeacher = allTeachers.find((teacher: any) => teacher.user.id === userResponse.data.id)
               teacher_id = ourTeacher.id
            }

            const user: User = {
               id: userResponse.data.id,
               teacher_id: teacher_id,
               student_id: student_id,
               first_name: userResponse.data.first_name,
               last_name: userResponse.data.last_name,
               middle_name: userResponse.data.middle_name,
               email: userResponse.data.email,
               user_role_id: userResponse.data.role.id
            }
            setCurrentUserInfo(user)

            return user
         } catch (error) {
            console.log('Error while updating current user info ', error)
            return { id: 0, teacher_id: null, student_id: null, first_name: '', last_name: '', middle_name: '', email: '', user_role_id: 0 }
         }
      }

      return { id: 0, teacher_id: null, student_id: null, first_name: '', last_name: '', middle_name: '', email: '', user_role_id: 0 }
   }

   const logOut = (): void => {
      setCurrentUserInfo(null)
      Cookies.remove('access')
      Cookies.remove('refresh')
   }

   return (
      <CurrentUserContext.Provider value={{ currentUser: currentUserInfo, updateCurrentUser: updateCurrentUserInfo, logOut }}> {children} </CurrentUserContext.Provider>
   )
}

export default CurrentUserProvider