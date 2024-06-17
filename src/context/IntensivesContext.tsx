import { FC, ReactNode, createContext, useState, useContext } from 'react'
import axios from 'axios'
import { Intensive } from '../utils/types/Intensive'

import { CurrentUserContext } from './CurrentUserContext'
import Cookies from 'js-cookie'

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

   const mapIntensives = async (items: any[]): Promise<Intensive[]> => {
      const mappedIntensives = await Promise.all(items.map(async (item: any) => {
         try {
            const flowResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/flows/${item.flow[0]}/`)
            const flowName = flowResponse.data.name

            return {
               id: item.id,
               name: item.name,
               description: item.description,
               is_open: item.is_open,
               open_dt: new Date(item.open_dt),
               close_dt: new Date(item.close_dt),
               flow: flowName
            }
         } catch (error) {
            console.error(error)
            return {
               id: item.id,
               name: item.name,
               description: item.description,
               is_open: item.is_open,
               open_dt: new Date(),
               close_dt: new Date(),
               flow: '' // или обработка ошибки по-другому
            }
         }
      }))

      return mappedIntensives
   }

   const getIntensives = async (): Promise<void> => {
      try {
         const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/intensives/`, {
            headers: {
               'Authorization': `Bearer ${Cookies.get('access')}`
            }
         })
         const openedIntensives = response.data.results.filter((item: any) => item.is_open)

         let userRoleIntensives = openedIntensives
         if (currentUser) {
            if (currentUser.user_role_id === 1) {
               console.log('ты студент')
               // code
            }

            if (currentUser.user_role_id === 3) {
               console.log('ты препод')
               userRoleIntensives = openedIntensives.filter((item: any) =>
                  item.teachers_command.some((teacherOnIntensive: any) => teacherOnIntensive.teacher.user.id === currentUser.id)
               );
            }
         }
         const mappedIntensives: Intensive[] = await mapIntensives(userRoleIntensives);

         // const mappedIntensives: Intensive[] = await mapIntensives(openedIntensives);
         console.log('замапленные интенсивы: ', mappedIntensives);
         setIntensives(mappedIntensives)
      } catch (error) {
         console.error(error)
      }
   }

   return (
      <IntensivesContext.Provider value={{ intensives, getIntensives }}> {children} </IntensivesContext.Provider>
   )
}

export default IntensivesProvider