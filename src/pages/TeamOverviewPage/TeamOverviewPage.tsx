import { FC, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { TeamsContext } from '../../context/TeamsContext'
import { CurrentUserContext } from '../../context/CurrentUserContext'
import { Team } from '../../utils/types/Team'

import Title from '../../components/Title/Title'
import OverviewContent from '../../components/OverviewContent/OverviewContent'

const TeamOverviewPage: FC = () => {
   const params = useParams()
   const { currentTeam, setCurrentTeamForStudent } = useContext(TeamsContext)
   const { currentUser } = useContext(CurrentUserContext)

   useEffect(() => {
      if (params.teamId && currentUser) {
         setCurrentTeamForStudent(parseInt(params.teamId, 10))
      }
   }, [currentUser])

   return (
      <>
         <Title text={currentTeam.name} />

         <OverviewContent>
            <div>
               <h2 className='text-black text-xl font-bold font-sans'>Наставник</h2>
               <div className='text-bright_gray text-base font-sans mt-2'>{currentTeam.mentorNameSurname}</div>
            </div>
            <div>
               <h2 className='text-black text-xl font-bold font-sans'>Тьютор</h2>
               <div className='text-bright_gray text-base font-sans mt-2'>{currentTeam.tutorNameSurname}</div>
            </div>
         </OverviewContent>
      </>
   )
}

export default TeamOverviewPage