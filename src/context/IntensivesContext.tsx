import { FC, ReactNode, createContext, useState, useContext } from 'react'
import axios from 'axios'
import { Intensive } from '../utils/types/Intensive'
import Cookies from 'js-cookie'

import { CurrentUserContext } from './CurrentUserContext'

interface IntensiveContextType {
   intensives: Intensive[],
   getIntensives: () => void
}

export const IntensivesContext = createContext<IntensiveContextType>({
   intensives: [],
   getIntensives: () => { }
})

interface IntensivesContextProviderProps {
   children: ReactNode
}
const IntensivesProvider: FC<IntensivesContextProviderProps> = ({ children }) => {

   const [intensives, setIntensives] = useState<Intensive[]>([])

   const { currentUser } = useContext(CurrentUserContext)

   const mapIntensives = (items: any[]): Intensive[] => {
      return items.map((item: any) => ({
         id: item.id,
         name: item.name,
         description: item.description,
         is_open: item.is_open,
         open_dt: item.open_dt.split('T')[0],
         close_dt: item.close_dt.split('T')[0]
      }))
   }

   const getIntensives = (): void => {
      // {
      //    headers: {
      //       'Authorization': `Bearer ${Cookies.get('access')}`
      //    }
      // }
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/intensives/`)
         .then(response => {
            const openedIntensives = response.data.results.filter((item: any) => item.is_open)

            let userRoleIntensives = openedIntensives
            if (currentUser) {
               if (currentUser.user_role_id === 3 || currentUser.user_role_id === 4) {
                  console.log('ты препод')
                  userRoleIntensives = openedIntensives.filter((item: any) =>
                     item.teachers_command.some((teacherOnIntensive: any) => teacherOnIntensive.teacher.user.id === currentUser.id))
               }

               if (currentUser.user_role_id === 2) {
                  console.log('ты студент')
               }
            }

            const AllUserRoleIntensives: Intensive[] = mapIntensives(userRoleIntensives)
            setIntensives(AllUserRoleIntensives)
         })
   }

   return (
      <IntensivesContext.Provider value={{ intensives, getIntensives }}> {children} </IntensivesContext.Provider>
   )
}

export default IntensivesProvider