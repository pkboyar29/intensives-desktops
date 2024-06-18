import { FC, ReactNode, createContext, useState, useContext } from 'react'
import axios from 'axios'
import { Intensive } from '../utils/types/Intensive'

import authHeader from '../utils/getHeaders'

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

   const mapIntensives = async (items: any[]): Promise<Intensive[]> => {
      const mappedIntensives = await Promise.all(items.map(async (item: any) => {
         try {
            console.log(item.flow[0])

            return {
               id: item.id,
               name: item.name,
               description: item.description,
               is_open: item.is_open,
               open_dt: new Date(item.open_dt),
               close_dt: new Date(item.close_dt),
               flow: item.flow[0]
            }
         } catch (error) {
            console.log(error)
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
         const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/intensives/`, { headers: await authHeader() })

         const mappedIntensives: Intensive[] = await mapIntensives(response.data.results);
         console.log('замапленные интенсивы: ', mappedIntensives);
         setIntensives(mappedIntensives)
      } catch (error) {
         console.log(error)
      }
   }

   return (
      <IntensivesContext.Provider value={{ intensives, getIntensives }}> {children} </IntensivesContext.Provider>
   )
}

export default IntensivesProvider