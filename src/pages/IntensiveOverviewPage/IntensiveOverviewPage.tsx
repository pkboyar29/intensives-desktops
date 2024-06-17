import { FC, useContext } from 'react'
import { useParams } from 'react-router-dom'

import { Intensive } from '../../utils/types/Intensive'
import { IntensivesContext } from '../../context/IntensivesContext'

import Title from '../../components/Title/Title'
import OverviewContent from '../../components/OverviewContent/OverviewContent'

const IntensiveOverviewPage: FC = () => {

   const { intensives } = useContext(IntensivesContext)
   const params = useParams()
   const currentIntensive: Intensive | undefined = intensives.find((intensive: Intensive) => intensive.id === Number(params.intensiveId))

   return (
      <>
         <Title text='Просмотр интенсива' />

         <OverviewContent>
            <div>
               <h2 className='text-black text-xl font-bold font-sans'>Название</h2>
               <div className='text-bright_gray text-base font-sans mt-2'>{currentIntensive?.name}</div>
            </div>
            <div>
               <h2 className='text-black text-xl font-bold font-sans'>Описание</h2>
               <div className='text-bright_gray text-base font-sans mt-2'>{currentIntensive?.description}</div>
            </div>
            <div>
               <h2 className='text-black text-xl font-bold font-sans'>Начало интенсива</h2>
               <div className='text-bright_gray text-base font-sans mt-2'>{currentIntensive?.open_dt.toLocaleDateString()}</div>
            </div>
            <div>
               <h2 className='text-black text-xl font-bold font-sans'>Окончание интенсива</h2>
               <div className='text-bright_gray text-base font-sans mt-2'>{currentIntensive?.close_dt.toLocaleDateString()}</div>
            </div>
            <div>
               <h2 className='text-black text-xl font-bold font-sans'>Учебный поток</h2>
               <div className='text-bright_gray text-base font-sans mt-2'>{currentIntensive?.flow}</div>
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