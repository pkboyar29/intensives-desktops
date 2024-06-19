import { FC, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Intensive } from '../../utils/types/Intensive'
import { IntensivesContext } from '../../context/IntensivesContext'
import { TeamsContext } from '../../context/TeamsContext'

import Title from '../../components/Title/Title'
import OverviewContent from '../../components/OverviewContent/OverviewContent'

const IntensiveOverviewPage: FC = () => {
   const { getIntensiveById } = useContext(IntensivesContext)
   const params = useParams()
   const [currentIntensiv, setCurrentIntensiv] = useState<Intensive | undefined>(undefined)
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
            <div>
               <h2 className='text-black text-xl font-bold font-sans'>Название</h2>
               <div className='text-bright_gray text-base font-sans mt-2'>{currentIntensiv?.name}</div>
            </div>
            <div>
               <h2 className='text-black text-xl font-bold font-sans'>Описание</h2>
               <div className='text-bright_gray text-base font-sans mt-2'>{currentIntensiv?.description}</div>
            </div>
            <div>
               <h2 className='text-black text-xl font-bold font-sans'>Начало интенсива</h2>
               <div className='text-bright_gray text-base font-sans mt-2'>{currentIntensiv?.open_dt.toLocaleDateString()}</div>
            </div>
            <div>
               <h2 className='text-black text-xl font-bold font-sans'>Окончание интенсива</h2>
               <div className='text-bright_gray text-base font-sans mt-2'>{currentIntensiv?.close_dt.toLocaleDateString()}</div>
            </div>
            <div>
               <h2 className='text-black text-xl font-bold font-sans'>Учебный поток</h2>
               <div className='text-bright_gray text-base font-sans mt-2'>{currentIntensiv?.flow}</div>
            </div>
            {/* <div>
               <h2 className='mini-title'>Команда преподавателей</h2>
               <div className="overview__content"></div>
            </div> */}
            {/* <div>
               <h2 className='mini-title'>Файлы</h2>
               <div className='overview__content'></div>
            </div> */}
         </OverviewContent>
      </>
   )
}

export default IntensiveOverviewPage