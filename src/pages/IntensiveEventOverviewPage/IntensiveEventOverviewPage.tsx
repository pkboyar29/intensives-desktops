import { FC, useContext } from 'react'
import { EventsContext } from '../../context/EventsContext'
import { useParams } from 'react-router-dom'
import { Event } from '../../utils/types/Event'

import './IntensiveEventOverviewPage.css'
import Title from '../../components/Title/Title'

const IntensiveEventOverviewPage: FC = () => {

   const events: Event[] = useContext(EventsContext)
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
               <div className="overview__content">{currentEvent?.descr}</div>
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
               <h2 className='mini-title'>Аудитория</h2>
               <div className="overview__content">{currentEvent?.auditory}</div>
            </div>
            {currentEvent?.markStrategy && (
               <div className="overview__item">
                  <h2 className='mini-title'>Шкала оценивания</h2>
                  <div className="overview__content">{currentEvent?.markStrategy}</div>
               </div>
            )}

         </div>
      </>
   )
}

export default IntensiveEventOverviewPage