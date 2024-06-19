import { FC, ReactNode, createContext, useState, useContext } from 'react'
import axios, { all } from 'axios'

import { CurrentUserContext } from './CurrentUserContext'

import { Event } from '../utils/types/Event'
import { Team } from '../utils/types/Team'
import { TeamsContext } from './TeamsContext'

interface EventsContextType {
   events: Event[],
   setEventsForIntensiv: (intensiveId: number) => Promise<Event[]>,
   setEventsForTeam: (teamId: number) => void
}

export const EventsContext = createContext<EventsContextType>({
   events: [],
   setEventsForIntensiv: async () => [],
   setEventsForTeam: () => { }
})

interface EventsContextProviderProps {
   children: ReactNode
}
const EventsProvider: FC<EventsContextProviderProps> = ({ children }) => {
   const [events, setEvents] = useState<Event[]>([])
   const { currentUser } = useContext(CurrentUserContext)
   const { getTeamById } = useContext(TeamsContext)

   const mapEvents = async (unmappedEvents: any[]): Promise<Event[]> => {
      const mappedEvents = await Promise.all(unmappedEvents.map(async (unmappedEvent: any) => mapEvent(unmappedEvent)))
      return mappedEvents
   }

   const mapEvent = async (unmappedEvent: any) => {
      try {
         const auditoryResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auditories/${unmappedEvent.auditory}`) // получить auditoryName
         const stageResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/stages/${unmappedEvent.stage}`)
         const markStrategyResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/mark_strategy/${unmappedEvent.mark_strategy}`) // получить markStrategyName
         const criteriasNamesPromises = unmappedEvent.criteria.map(async (criteria: number) => {
            const criteriaResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/criteria/${criteria}`)
            return criteriaResponse.data.name
         })
         const criteriasNames: string[] = await Promise.all(criteriasNamesPromises)

         const teams: Team[] = unmappedEvent.commands.map(async (teamId: number) => {
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
         await Promise.all(unmappedEvent.teachers_command.map(async (teacherId: number) => {
            const teacherOnIntensiveResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/teachers_on_intensives/${teacherId}/`)
            if (teacherOnIntensiveResponse.data.role === 4 && teacherOnIntensiveResponse.data.teacher.user.id === currentUser?.id) {
               isCurrentTeacherJury = true
            }
         }))

         return {
            id: unmappedEvent.id,
            name: unmappedEvent.name,
            description: unmappedEvent.description,
            stageId: unmappedEvent.stage,
            stageName: stageResponse.data.name,
            startDate: new Date(unmappedEvent.start_dt),
            finishDate: new Date(unmappedEvent.finish_dt),
            auditoryId: unmappedEvent.auditory,
            auditoryName: auditoryResponse.data.name,
            markStrategyId: unmappedEvent.mark_strategy,
            markStrategyName: markStrategyResponse.data.name,
            criterias: unmappedEvent.criteria,
            criteriasNames: criteriasNames,
            teams: resolvedTeams,
            teachers_command: unmappedEvent.teachers_command,
            isCurrentTeacherJury: isCurrentTeacherJury
         }
      } catch (error) {
         console.log(error)
         return {
            id: 0, name: 'Unknown', description: 'Unknown', stageId: 0, stageName: 'Unknown', startDate: new Date(), finishDate: new Date(), auditoryId: 0,
            auditoryName: 'Unknown', markStrategyId: 0, markStrategyName: 'Unknown', criterias: [], criteriasNames: [], teams: [], teachers_command: [], isCurrentTeacherJury: false
         }
      }
   }

   const setAndGetEventsForIntensiv = async (intensiveId: number): Promise<Event[]> => {
      try {
         const eventsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/events/?intensiv=${intensiveId}`)
         const unmappedEvents = eventsResponse.data.results

         const mappedEvents: Event[] = await mapEvents(unmappedEvents)
         setEvents(mappedEvents)

         return mappedEvents
      } catch (error) {
         console.log(error)
         throw error
      }
   }

   const setEventsForTeam = async (teamId: number): Promise<void> => {
      try {
         const team: Promise<Team> = getTeamById(teamId)

         const eventsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/events/?intensiv=${(await team).intensiveId}`)
         const unmappedEvents = eventsResponse.data.results
         console.log('все события это ', unmappedEvents)
         console.log('наша команда с id ', teamId)
         const ourTeamEvents = unmappedEvents.filter((unmappedEvent: any) => {
            const eventTeams: any[] = unmappedEvent.commands
            console.log('все команды из массива это ', eventTeams)
            const isOurTeamInEvent = eventTeams.some((eventTeam: any) => eventTeam === teamId)
            return isOurTeamInEvent
         })

         const mappedEvents: Event[] = await mapEvents(ourTeamEvents)
         setEvents(mappedEvents)
      } catch (error) {
         console.log(error)
      }
   }

   return (
      <EventsContext.Provider value={{ events, setEventsForIntensiv: setAndGetEventsForIntensiv, setEventsForTeam }}> {children} </EventsContext.Provider>
   )
}

export default EventsProvider