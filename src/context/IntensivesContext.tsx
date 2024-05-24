import { FC, ReactNode, createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { Intensive } from '../utils/types/Intensive'
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

   const getIntensives = (): void => {
      // {
      //    headers: {
      //       'Authorization': `Bearer ${Cookies.get('access')}`
      //    }
      // }
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/intensives/`)
         .then(response => {
            const filteredIntensives: Intensive[] = response.data.results.map((item: any) => ({
               id: item.id,
               name: item.name,
               description: item.description,
               is_open: item.is_open,
               open_dt: item.open_dt.split('T')[0],
               close_dt: item.close_dt.split('T')[0]
            }))
            setIntensives(filteredIntensives)
         })
   }

   // можно прописать дополнительную бизнес логику (например, методы удаления, добавления) и передать методы в value, также надо будет создать состояние intensives, чтобы оно внутри провайдера изменялось
   // ну и соответственно надо будет дополнительно тип у контекста изменить, потому что там будут не только intensives
   return (
      <IntensivesContext.Provider value={{ intensives, getIntensives }}> {children} </IntensivesContext.Provider>
   )
}

export default IntensivesProvider