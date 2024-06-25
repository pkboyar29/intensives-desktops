import { FC, ReactNode, createContext, useState } from 'react'
import axios from 'axios'
import { Intensive } from '../utils/types/Intensive'

import authHeader from '../utils/getHeaders'

interface IntensiveContextType {
   intensives: Intensive[],
   getIntensives: () => void,
   getIntensiveById: (intensiveId: number) => Promise<Intensive>
}

export const IntensivesContext = createContext<IntensiveContextType>({
   intensives: [],
   getIntensives: () => { },
   getIntensiveById: async () => Promise.resolve({ id: 0, name: '', description: '', is_open: false, open_dt: new Date(0), close_dt: new Date(0), flow: '' })
})

interface IntensivesContextProviderProps {
   children: ReactNode
}

const IntensivesProvider: FC<IntensivesContextProviderProps> = ({ children }) => {
   const [intensives, setIntensives] = useState<Intensive[]>([])

   const mapIntensivs = async (unmappedIntensivs: any[]): Promise<Intensive[]> => {
      const mappedIntensives = await Promise.all(unmappedIntensivs.map(async (unmappedIntensiv: any) => mapIntensiv(unmappedIntensiv)))
      return mappedIntensives
   }

   const mapIntensiv = async (unmappedIntensiv: any): Promise<Intensive> => {
      try {
         return {
            id: unmappedIntensiv.id,
            name: unmappedIntensiv.name,
            description: unmappedIntensiv.description,
            is_open: unmappedIntensiv.is_open,
            open_dt: new Date(unmappedIntensiv.open_dt),
            close_dt: new Date(unmappedIntensiv.close_dt),
            flow: unmappedIntensiv.flow[0]
         }
      } catch (error) {
         console.log(error)
         return { id: 0, name: '', description: '', is_open: false, open_dt: new Date(), close_dt: new Date(), flow: '' }
      }
   }

   const getIntensives = async (): Promise<void> => {
      try {
         const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/intensives/`, { headers: await authHeader() })

         const mappedIntensives: Intensive[] = await mapIntensivs(response.data.results);
         console.log('замапленные интенсивы: ', mappedIntensives);
         setIntensives(mappedIntensives)
      } catch (error) {
         console.log(error)
      }
   }

   const getIntensiveById = async (intensiveId: number): Promise<Intensive> => {
      const intensivResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/intensives/${intensiveId}/`, { headers: await authHeader() })
      const mappedIntensiv = mapIntensiv(intensivResponse.data)
      return mappedIntensiv
   }

   return (
      <IntensivesContext.Provider value={{ intensives, getIntensives, getIntensiveById }}> {children} </IntensivesContext.Provider>
   )
}

export default IntensivesProvider