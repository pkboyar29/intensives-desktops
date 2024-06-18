import { FC, ReactNode, createContext, useState } from 'react'
import axios from 'axios'

import { Team } from '../utils/types/Team'

interface TeamsContextType {
   teams: Team[],
   getTeams: (intensiveId: number) => void
}

export const TeamsContext = createContext<TeamsContextType>({
   teams: [],
   getTeams: () => { }
})

interface TeamsContextProviderProps {
   children: ReactNode
}

const TeamsProvider: FC<TeamsContextProviderProps> = ({ children }) => {
   const [teams, setTeams] = useState<Team[]>([])

   const mapTeams = async (items: any[]): Promise<Team[]> => {
      let tutorNameSurname = 'Нету'
      let mentorNameSurname = 'Нету'

      const mappedTeams = await Promise.all(items.map(async (item: any) => {
         if (item.tutor) {
            const tutorResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/teachers/${item.tutor}`)
            tutorNameSurname = `${tutorResponse.data.user.last_name} ${tutorResponse.data.user.first_name.charAt(0)}.${tutorResponse.data.user.middle_name.charAt(0)}.`
         }
         if (item.mentor) {
            const mentorResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/students/${item.mentor}`)
            mentorNameSurname = `${mentorResponse.data.user.last_name} ${mentorResponse.data.user.first_name.charAt(0)}.${mentorResponse.data.user.middle_name.charAt(0)}.`
         }

         try {
            return {
               id: item.id,
               name: item.name,
               tutorId: item.tutor,
               mentorId: item.mentor,
               tutorNameSurname: tutorNameSurname,
               mentorNameSurname: mentorNameSurname
            }
         } catch (error) {
            console.log(error)
            return {
               id: 0,
               name: 'Unknown',
               tutorId: 0,
               mentorId: 0,
               tutorNameSurname: 'Unknown',
               mentorNameSurname: 'Unknown'
            }
         }
      }))

      return mappedTeams
   }

   const getTeams = async (intensiveId: number) => {
      const responseTeams = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/commands_on_intensives/`)
      const allTeams = responseTeams.data.results
      console.log(allTeams)
      const ourIntensiveTeams = allTeams.filter((team: any) => team.intensive === intensiveId)
      const mappedTeams: Team[] = await mapTeams(ourIntensiveTeams)
      setTeams(mappedTeams)
   }

   return (
      <TeamsContext.Provider value={{ teams, getTeams }}>
         {children}
      </TeamsContext.Provider>
   )
}

export default TeamsProvider