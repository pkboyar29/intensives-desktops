import { FC, ReactNode, createContext } from 'react'
import { Event } from '../utils/types/Event'

export const EventsContext = createContext<Event[]>([])

interface EventsContextProviderProps {
   events: Event[],
   children: ReactNode
}
const EventsProvider: FC<EventsContextProviderProps> = ({ events, children }) => {
   // можно прописать дополнительную бизнес логику (например, методы удаления, добавления) и передать методы в value, также надо будет создать состояние intensives, чтобы оно внутри провайдера изменялось
   // ну и соответственно надо будет дополнительно тип у контекста изменить, потому что там будут не только intensives
   return (
      <EventsContext.Provider value={events}> {children} </EventsContext.Provider>
   )
}

export default EventsProvider