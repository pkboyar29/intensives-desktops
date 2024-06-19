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

   useEffect(() => {
      const setCurrentIntensivForTeacher = async () => {
         if (params.intensiveId) {
            const currentIntensiv: Intensive = await getIntensiveById(parseInt(params.intensiveId, 10))
            setCurrentIntensiv(currentIntensiv)
         }
      }
      setCurrentIntensivForTeacher()
   }, [params.intensiveId])

   useEffect(() => {
      const setCurrentIntensivForStudent = async () => {
         if (params.teamId) {
            const currentIntensiv: Intensive = await getIntensiveById(currentTeam.intensiveId)
            setCurrentIntensiv(currentIntensiv)
         }
      }
      setCurrentIntensivForStudent()
   }, [params.teamId])

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