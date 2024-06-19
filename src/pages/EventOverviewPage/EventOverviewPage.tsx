import { FC, useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'

import authHeader from '../../utils/getHeaders'

import { EventsContext } from '../../context/EventsContext'
import { CurrentUserContext } from '../../context/CurrentUserContext'

import { Event } from '../../utils/types/Event'
import { Team } from '../../utils/types/Team'

import Title from '../../components/Title/Title'
import OverviewContent from '../../components/OverviewContent/OverviewContent'
import OverviewItem from '../../components/OverviewItem/OverviewItem'

type AnswerSubmitValues = {
   textAnswer: string
}

const EventOverviewPage: FC = () => {
   const { currentEvent, setCurrentEventById } = useContext(EventsContext)
   const { currentUser } = useContext(CurrentUserContext)

   const params = useParams()
   const navigate = useNavigate()

   const { register, handleSubmit } = useForm<AnswerSubmitValues>({
      'mode': 'onBlur'
   })

   const onSubmit = async (data: AnswerSubmitValues) => {
      if (params.eventId && params.teamId) {
         const requestData = {
            text: data.textAnswer,
            event: parseInt(params.eventId, 10),
            student: currentUser?.student_id,
            command: parseInt(params.teamId, 10)
         }
         try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/answers/`, requestData, { headers: await authHeader() })
            console.log(response.data)
         } catch (error) {
            console.log(error)
         }
      }
   }

   useEffect(() => {
      if (params.eventId) {
         setCurrentEventById(parseInt(params.eventId))
      }
   }, [params.eventId, currentUser])

   return (
      <>
         <Title text='Просмотр мероприятия' />

         <OverviewContent>
            <OverviewItem title='Название команды' value={currentEvent?.name} />
            <OverviewItem title='Описание мероприятия' value={currentEvent?.description} />
            <OverviewItem title='Этап' value={currentEvent?.stageName} />
            <OverviewItem title='Дата начала мероприятия' value={currentEvent?.startDate.toLocaleString()} />
            <OverviewItem title='Дата окончания мероприятия' value={currentEvent?.finishDate.toLocaleString()} />
            <OverviewItem title='Аудитория' value={currentEvent?.auditoryName} />
            <OverviewItem title='Шкала оценивания' value={currentEvent?.markStrategyName} />

            {currentEvent?.isCurrentTeacherJury && (
               <div>
                  <h2 className='text-black text-xl font-bold font-sans'>Вы являетесь жюри в этом интенсиве</h2>
               </div>
            )}
            <div>
               <h2 className='text-black text-xl font-bold font-sans'>Прикрепленные команды</h2>
               <div className='text-bright_gray text-base font-sans mt-2'>
                  {currentEvent?.teams.map((team: Team) => (
                     <div key={team.id} className='flex items-center gap-8 mb-5'>
                        <div key={team.id}>{team.name}</div>
                        {(currentEvent?.isCurrentTeacherJury && currentEvent.markStrategyId !== 1 && currentUser?.user_role_id === 3)
                           && <button onClick={() => navigate(`/teacher/${params.intensiveId}/team-evaluation/${params.eventId}/${team.id}`)}
                              className='bg-blue rounded-xl px-5 py-2 font-bold font-sans text-white text-sm'>поставить оценку</button>}
                     </div>
                  ))}
               </div>
            </div>

            {(currentUser?.user_role_id === 1 && currentEvent?.resultTypeId !== 1) &&
               <>
                  <h2 className='text-black text-xl font-bold font-sans'>Отправка ответа</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3 w-[500px]'>
                     <textarea className='border border-solid border-gray rounded-xl h-36 p-3 font-sans text-base' placeholder='Введите текстовый ответ' {...register('textAnswer')} />
                     <button type='submit' className='font-bold font-inter py-3 px-5 rounded-xl text-white bg-blue w-36 self-end mb-10'>Отправить</button>
                  </form>
               </>
            }
         </OverviewContent >
      </>
   )
}

export default EventOverviewPage