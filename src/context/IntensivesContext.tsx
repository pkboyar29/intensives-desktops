import { FC, ReactNode, createContext } from 'react'
import { Intensive } from '../utils/types/Intensive'

export const IntensivesContext = createContext<Intensive[]>([])

interface IntensiveProviderProps {
   intensives: Intensive[],
   children: ReactNode
}
const IntensiveContextProvider: FC<IntensiveProviderProps> = ({ intensives, children }) => {
   return (
      <IntensivesContext.Provider value={intensives}> {children} </IntensivesContext.Provider>
   )
}

export default IntensiveContextProvider