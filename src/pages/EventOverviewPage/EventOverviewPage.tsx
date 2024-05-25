import { FC, useContext } from 'react'
import { EventsContext } from '../../context/EventsContext'
import { useParams } from 'react-router-dom'
import { Event } from '../../utils/types/Event'

import './EventOverviewPage.css'
import Title from '../../components/Title/Title'

const EventOverviewPage: FC = () => {

   const { events } = useContext(EventsContext)
   const params = useParams()

   const currentEvent: Event | undefined = events.find((event: Event) => event.id === Number(params.eventId))

   return (
      <>
         <Title text='Просмотр мероприятия' />

         <div className="overview__container">
            <div className="overview__item">
               <h2 className='mini-title'>Название мероприятия</h2>
               <div className="overview__content">{currentEvent?.name}</div>
            </div>
            <div className="overview__item">
               <h2 className='mini-title'>Описание мероприятия</h2>
               <div className="overview__content">{currentEvent?.description}</div>
            </div>
            <div className="overview__item">
               <h2 className='mini-title'>Этап</h2>
               <div className="overview__content">{currentEvent?.stageName}</div>
            </div>
            <div className="overview__item">
               <h2 className='mini-title'>Дата начала мероприятия</h2>
               <div className="overview__content">{currentEvent?.startDate.toLocaleDateString()}</div>
            </div>
            <div className="overview__item">
               <h2 className='mini-title'>Дата окончания мероприятия</h2>
               <div className="overview__content">{currentEvent?.finishDate.toLocaleDateString()}</div>
            </div>
            <div className="overview__item">
               <h2 className='mini-title'>Номер аудитории</h2>
               <div className="overview__content">{currentEvent?.auditoryName}</div>
            </div>
            <div className="overview__item">
               <h2 className='mini-title'>Шкала оценивания</h2>
               <div className="overview__content">{currentEvent?.markStrategyName}</div>
            </div>

         </div>
      </>
   )
}

export default EventOverviewPage