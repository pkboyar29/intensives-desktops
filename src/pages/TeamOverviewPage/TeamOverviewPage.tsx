import { FC, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { TeamsContext } from '../../context/TeamsContext'
import { CurrentUserContext } from '../../context/CurrentUserContext'

import Title from '../../components/Title/Title'
import OverviewContent from '../../components/OverviewContent/OverviewContent'

const TeamOverviewPage: FC = () => {
   const params = useParams()
   const { currentTeam, setCurrentTeamForStudent } = useContext(TeamsContext)
   const { currentUser } = useContext(CurrentUserContext)
   const [isLoading, setIsLoading] = useState<boolean>(true)

   useEffect(() => {
      const fetchData = async () => {
         if (params.teamId && currentUser) {
            await setCurrentTeamForStudent(parseInt(params.teamId, 10))
            setIsLoading(false)
         }
      }
      fetchData()
   }, [currentUser])

   if (isLoading) {
      return (
         <div className='font-bold font-sans text-2xl mt-3'>Загрузка...</div>
      )
   }

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