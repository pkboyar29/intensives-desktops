import { FC, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Intensive } from '../../utils/types/Intensive'
import { IntensivesContext } from '../../context/IntensivesContext'
import { TeamsContext } from '../../context/TeamsContext'

import Title from '../../components/Title/Title'
import OverviewContent from '../../components/OverviewContent/OverviewContent'
import OverviewItem from '../../components/OverviewItem/OverviewItem'

const IntensiveOverviewPage: FC = () => {
   const params = useParams()
   const [currentIntensiv, setCurrentIntensiv] = useState<Intensive | undefined>(undefined)
   const { getIntensiveById } = useContext(IntensivesContext)
   const { currentTeam } = useContext(TeamsContext)
   const [isLoading, setIsLoading] = useState<boolean>(true)

   useEffect(() => {
      const fetchDataForTeacher = async () => {
         if (params.intensiveId) {
            const currentIntensiv: Intensive = await getIntensiveById(parseInt(params.intensiveId, 10))
            await setCurrentIntensiv(currentIntensiv)
            setIsLoading(false)
         }
      }
      fetchDataForTeacher()
   }, [params.intensiveId])

   useEffect(() => {
      const fetchDataForStudent = async () => {
         if (params.teamId) {
            const currentIntensiv: Intensive = await getIntensiveById(currentTeam.intensiveId)
            await setCurrentIntensiv(currentIntensiv)
            setIsLoading(false)
         }
      }
      fetchDataForStudent()
   }, [params.teamId])

   if (isLoading) {
      return (
         <div className='font-bold font-sans text-2xl mt-3'>Загрузка...</div>
      )
   }

   return (
      <>
         <Title text='Просмотр интенсива' />

         <OverviewContent>
            <OverviewItem title='Название интенсива' value={currentIntensiv?.name} />
            <OverviewItem title='Описание' value={currentIntensiv?.description} />
            <OverviewItem title='Начало интенсива' value={currentIntensiv?.open_dt.toLocaleDateString()} />
            <OverviewItem title='Окончание интенсива' value={currentIntensiv?.close_dt.toLocaleDateString()} />
            <OverviewItem title='Учебный поток' value={currentIntensiv?.flow} />
            {/* <OverviewItem title='Команда преподавателей' value={} /> */}
            {/* <OverviewItem title='Файлы' value={} /> */}
         </OverviewContent>
      </>
   )
}

export default IntensiveOverviewPage