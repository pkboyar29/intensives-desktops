import { FC, ReactNode, createContext } from 'react'
import { Intensive } from '../utils/types/Intensive'

export const IntensivesContext = createContext<Intensive[]>([])

interface IntensiveProviderProps {
   intensives: Intensive[],
   children: ReactNode
}
const IntensiveContextProvider: FC<IntensiveProviderProps> = ({ intensives, children }) => {
   // можно прописать дополнительную бизнес логику (например, методы удаления, добавления) и передать методы в value, также надо будет создать состояние intensives, чтобы оно внутри провайдера изменялось
   // ну и соответственно надо будет дополнительно тип у контекста изменить, потому что там будут не только intensives
   return (
      <IntensivesContext.Provider value={intensives}> {children} </IntensivesContext.Provider>
   )
}

export default IntensiveContextProvider