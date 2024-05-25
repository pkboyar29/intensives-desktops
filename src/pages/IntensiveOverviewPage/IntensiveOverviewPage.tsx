import { FC, useContext } from 'react'
import { useParams } from 'react-router-dom'

import { Intensive } from '../../utils/types/Intensive'
import { IntensivesContext } from '../../context/IntensivesContext'

import './IntensiveOverviewPage.css'
import Title from '../../components/Title/Title'

const IntensiveOverviewPage: FC = () => {

   const { intensives } = useContext(IntensivesContext)
   const params = useParams()
   const currentIntensive: Intensive | undefined = intensives.find((intensive: Intensive) => intensive.id === Number(params.intensiveId))

   return (
      <>
         <Title text='Просмотр интенсива' />

         <div className="overview__container">
            <div className="overview__item">
               <h2 className='mini-title'>Название</h2>
               <div className="overview__content">{currentIntensive?.name}</div>
            </div>
            <div className="overview__item">
               <h2 className='mini-title'>Описание</h2>
               <div className="overview__content">{currentIntensive?.description}</div>
            </div>
            <div className="overview__item">
               <h2 className='mini-title'>Начало интенсива</h2>
               <div className="overview__content">{currentIntensive?.open_dt.toLocaleDateString()}</div>
            </div>
            <div className="overview__item">
               <h2 className='mini-title'>Окончание интенсива</h2>
               <div className="overview__content">{currentIntensive?.close_dt.toLocaleDateString()}</div>
            </div>
            <div className="overview__item">
               <h2 className='mini-title'>Учебный поток</h2>
               <div className="overview__content">{currentIntensive?.flow}</div>
            </div>
            {/* <div className="overview__item">
               <h2 className='mini-title'>Команда преподавателей</h2>
               <div className="overview__content"></div>
            </div> */}
            <div className="overview__item">
               <h2 className='mini-title'>Команды</h2>
               <div className="overview__content"></div>
            </div>
            <div className="overview__item">
               <h2 className='mini-title'>Список ролей для студентов</h2>
               <div className="overview__content"></div>
            </div>
            <div className="overview__item">
               <h2 className='mini-title'>Файлы</h2>
               <div className="overview__content"></div>
            </div>
         </div>

      </>
   )
}

export default IntensiveOverviewPage