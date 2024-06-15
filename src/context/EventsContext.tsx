import { FC, ReactNode, createContext, useState, useContext } from 'react'
import axios from 'axios'

import { CurrentUserContext } from './CurrentUserContext'

import { Event } from '../utils/types/Event'
import { Team } from '../utils/types/Team'

interface EventsContextType {
   events: Event[],
   getEvents: (intensiveId: number) => void
}

export const EventsContext = createContext<EventsContextType>({
   events: [],
   getEvents: () => { }
})

interface EventsContextProviderProps {
   children: ReactNode
}
const EventsProvider: FC<EventsContextProviderProps> = ({ children }) => {

   const [events, setEvents] = useState<Event[]>([])

   const { currentUser } = useContext(CurrentUserContext)

   const mapEvents = async (items: any[]): Promise<Event[]> => {
      const mappedEvents = await Promise.all(items.map(async (item: any) => {
         try {

            const auditoryResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auditories/${item.auditory}`) // получить auditoryName
            const stageResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/stages/${item.stage}`)
            const markStrategyResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/mark_strategy/${item.mark_strategy}`) // получить markStrategyName
            const criteriasNamesPromises = item.criteria.map(async (criteria: number) => {
               const criteriaResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/criteria/${criteria}`)
               return criteriaResponse.data.name
            })
            const criteriasNames: string[] = await Promise.all(criteriasNamesPromises)

            const teams: Team[] = item.commands.map(async (teamId: number) => {
               const teamResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/commands_on_intensives/${teamId}/`)
               return {
                  id: teamId,
                  name: teamResponse.data.name,
                  tutorId: teamResponse.data.teacher,
                  mentorId: teamResponse.data.tutor,
                  tutorNameSurname: null,
                  mentorNameSurname: null
               }
            })

            const resolvedTeams = await Promise.all(teams)

            let isCurrentTeacherJury: boolean = false
            await Promise.all(item.teachers_command.map(async (teacherId: number) => {
               const teacherOnIntensiveResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/teachers_on_intensives/${teacherId}/`)
               if (teacherOnIntensiveResponse.data.role[0] === 4 && teacherOnIntensiveResponse.data.teacher.user.id === currentUser?.id) {
                  isCurrentTeacherJury = true
               }
            }))

            return {
               id: item.id,
               name: item.name,
               description: item.description,
               stageId: item.stage,
               stageName: stageResponse.data.name,
               startDate: new Date(item.start_dt),
               finishDate: new Date(item.finish_dt),
               auditoryId: item.auditory,
               auditoryName: auditoryResponse.data.name,
               markStrategyId: item.mark_strategy,
               markStrategyName: markStrategyResponse.data.name,
               criterias: item.criteria,
               criteriasNames: criteriasNames,
               teams: resolvedTeams,
               teachers_command: item.teachers_command,
               isCurrentTeacherJury: isCurrentTeacherJury
            }
         } catch (error) {
            console.log(error)
            return {
               id: 0,
               name: 'Unknown',
               description: 'Unknown',
               stageId: 0,
               stageName: 'Unknown',
               startDate: new Date(),
               finishDate: new Date(),
               auditoryId: 0,
               auditoryName: 'Unknown',
               markStrategyId: 0,
               markStrategyName: 'Unknown',
               criterias: [],
               criteriasNames: [],
               teams: [],
               teachers_command: [],
               isCurrentTeacherJury: false
            }
         }
      }))

      return mappedEvents
   }

   const getEvents = async (intensiveId: number): Promise<void> => {
      try {
         const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/events/`)
         const allEvents = response.data.results
         const ourIntensiveEvents = await Promise.all(allEvents.map(async (event: any) => {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/stages/${event.stage}/`)
            const stageIntensive = response.data.intensive
            if (stageIntensive === intensiveId) {
               return event
            } else {
               return null
            }
         }))
         const filteredOurIntensiveEvents = ourIntensiveEvents.filter((event: any) => event !== null)
         // console.log('незамапленные мероприятия: ', filteredOurIntensiveEvents)
         const mappedEvents: Event[] = await mapEvents(filteredOurIntensiveEvents)
         console.log('замаппленные мероприятия: ', mappedEvents)
         setEvents(mappedEvents)

      } catch (error) {
         console.log(error)
      }
   }

   return (
      <EventsContext.Provider value={{ events, getEvents }}> {children} </EventsContext.Provider>
   )
}

export default EventsProvider