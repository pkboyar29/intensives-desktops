import { FC, useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { EventsContext } from '../../context/EventsContext'
import { CurrentUserContext } from '../../context/CurrentUserContext'

import { Event } from '../../utils/types/Event'
import { Team } from '../../utils/types/Team'

import Title from '../../components/Title/Title'
import OverviewContent from '../../components/OverviewContent/OverviewContent'

const EventOverviewPage: FC = () => {
   const { events, setEventsForIntensiv } = useContext(EventsContext)
   const { currentUser } = useContext(CurrentUserContext)

   const params = useParams()
   const navigate = useNavigate()

   useEffect(() => {
      if (params.intensiveId && currentUser) {
         setEventsForIntensiv(parseInt(params.intensiveId, 10))
      }
   }, [currentUser])

   const [currentEvent, setCurrentEvent] = useState<Event | undefined>(undefined)

   useEffect(() => {
      setCurrentEvent(events.find((event: Event) => event.id === Number(params.eventId)))
      console.log('устанавливаем current event')
   }, [events, currentEvent])

   return (
      <>
         <Title text='Просмотр мероприятия' />

         <OverviewContent>
            <div>
               <h2 className='text-black text-xl font-bold font-sans'>Название мероприятия</h2>
               <div className='text-bright_gray text-base font-sans mt-2'>{currentEvent?.name}</div>
            </div>
            <div>
               <h2 className='text-black text-xl font-bold font-sans'>Описание мероприятия</h2>
               <div className='text-bright_gray text-base font-sans mt-2'>{currentEvent?.description}</div>
            </div>
            <div>
               <h2 className='text-black text-xl font-bold font-sans'>Этап</h2>
               <div className='text-bright_gray text-base font-sans mt-2'>{currentEvent?.stageName}</div>
            </div>
            <div>
               <h2 className='text-black text-xl font-bold font-sans'>Дата начала мероприятия</h2>
               <div className='text-bright_gray text-base font-sans mt-2'>{currentEvent?.startDate.toLocaleDateString()}</div>
            </div>
            <div>
               <h2 className='text-black text-xl font-bold font-sans'>Дата окончания мероприятия</h2>
               <div className='text-bright_gray text-base font-sans mt-2'>{currentEvent?.finishDate.toLocaleDateString()}</div>
            </div>
            <div>
               <h2 className='text-black text-xl font-bold font-sans'>Номер аудитории</h2>
               <div className='text-bright_gray text-base font-sans mt-2'>{currentEvent?.auditoryName}</div>
            </div>
            <div>
               <h2 className='text-black text-xl font-bold font-sans'>Шкала оценивания</h2>
               <div className='text-bright_gray text-base font-sans mt-2'>{currentEvent?.markStrategyName}</div>
            </div>
            {currentEvent?.isCurrentTeacherJury && (
               <div>
                  <h2 className='text-black text-xl font-bold font-sans'>Вы являетесь жюри в этом интенсиве</h2>
               </div>
            )}
            <div>
               <h2 className='text-black text-xl font-bold font-sans'>Прикрепленные команды</h2>
               <div className='text-bright_gray text-base font-sans mt-2'>
                  {currentEvent?.teams.map((team: Team) => (
                     <div className='flex items-center gap-8 mb-5'>
                        <div key={team.id}>{team.name}</div>
                        {(currentEvent?.isCurrentTeacherJury && currentEvent.markStrategyId !== 1)
                           && <button onClick={() => navigate(`/teacher/${params.intensiveId}/team-evaluation/${params.eventId}/${team.id}`)}
                              className='bg-blue rounded-xl px-5 py-2 font-bold font-sans text-white text-sm'>поставить оценку</button>}
                     </div>
                  ))}
               </div>
            </div>
         </OverviewContent>
      </>
   )
}

export default EventOverviewPage