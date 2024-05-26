import { FC, useContext, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { EventsContext } from '../../context/EventsContext'
import { CurrentUserContext } from '../../context/CurrentUserContext'

import { Event } from '../../utils/types/Event'
import { Team } from '../../utils/types/Team'

import './EventOverviewPage.css'
import Title from '../../components/Title/Title'

const EventOverviewPage: FC = () => {

   const { events, getEvents } = useContext(EventsContext)
   const { currentUser } = useContext(CurrentUserContext)
   const params = useParams()
   const navigate = useNavigate()

   useEffect(() => {
      if (params.intensiveId && currentUser) {
         getEvents(parseInt(params.intensiveId, 10))
      }
   }, [currentUser])

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
            {currentEvent?.isCurrentTeacherJury && (
               <div className="overview__item">
                  <h2 className='mini-title'>Вы являетесь жюри в этом интенсиве!</h2>
               </div>
            )}
            <div className="overview__item">
               <h2 className='mini-title'>Прикрепленные команды</h2>
               <div className="overview__content">
                  {currentEvent?.teams.map((team: Team) => (
                     <div className='team'>
                        <div key={team.id} className='team__item'>{team.name}</div>
                        {currentEvent?.isCurrentTeacherJury && <button onClick={() => navigate(`/intensive/${params.intensiveId}/team-evaluation/${params.eventId}/${team.id}`)} className='team__button'>поставить оценку</button>}
                     </div>
                  ))}
               </div>
            </div>

         </div>
      </>
   )
}

export default EventOverviewPage