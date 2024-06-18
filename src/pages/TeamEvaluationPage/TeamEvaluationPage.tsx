import { FC, useEffect, useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios, { all } from 'axios'
import { useForm } from 'react-hook-form'

import { TeamsContext } from '../../context/TeamsContext'
import { EventsContext } from '../../context/EventsContext'
import { CurrentUserContext } from '../../context/CurrentUserContext'
import authHeader from '../../utils/getHeaders'

import Title from '../../components/Title/Title'
import { Team } from '../../utils/types/Team'
import { Event } from '../../utils/types/Event'

type FormValues = {
   marks: { criteriaId: number; mark: number }[],
   comment: string
}

const TeamEvaluationPage: FC = () => {
   const params = useParams()
   const navigate = useNavigate()
   const { teams, getTeams } = useContext(TeamsContext)
   const { events, getEvents } = useContext(EventsContext)
   const { currentUser } = useContext(CurrentUserContext)
   const [currentAnswer, setCurrentAnswer] = useState<any>()

   const { register, handleSubmit } = useForm<FormValues>({
      'mode': 'onBlur',
      defaultValues: {
         marks: [],
         comment: ''
      }
   })

   const currentTeam: Team | undefined = teams.find((team: Team) => {
      if (params.teamId) {
         return team.id === parseInt(params.teamId, 10)
      }
   })

   const currentEvent: Event | undefined = events.find((event: Event) => {
      if (params.eventId) {
         return event.id === parseInt(params.eventId, 10)
      }
   })

   useEffect(() => {
      fetchInitialData()
   }, [])

   const fetchInitialData = async () => {
      try {
         if (params.intensiveId && params.eventId) {
            await getTeams(parseInt(params.intensiveId, 10))
            await getEvents(parseInt(params.intensiveId, 10))
         }
         // вызвать все get методы или вызвать их в компоненте App?

         getCurrentAnswer()

      } catch (error) {
         console.log(error)
      }
   }

   const getCurrentAnswer = async () => {
      const answersResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/answers/`, { headers: await authHeader() })
      const allAnswers = answersResponse.data.results
      const currentEventAnswers = allAnswers.filter((answer: any) => {
         if (params.eventId) {
            return answer.event === parseInt(params.eventId, 10)
         }
      })
      const currentTeamAnswer = currentEventAnswers.find((answer: any) => String(answer.command) === String(params.teamId))
      setCurrentAnswer(currentTeamAnswer)
   }

   const onSubmit = (data: FormValues) => {
      const marks = data.marks

      marks.forEach(async (mark: any) => {
         try {
            let requestBody
            if (mark.criteriaId === '0') {
               requestBody = {
                  mark: mark.mark,
                  comment: data.comment,
                  answer: currentAnswer.id,
                  teacher: currentUser?.teacher_id
               }
            } else {
               requestBody = {
                  mark: mark.mark,
                  comment: data.comment,
                  answer: currentAnswer.id,
                  criteria: mark.criteriaId,
                  teacher: currentUser?.teacher_id
               }
            }
            console.log(requestBody)

            const markResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/marks/`, requestBody)
            console.log(markResponse.data)
         } catch (error) {
            console.log(error)
         }
      })
   }

   if (!currentTeam) {
      return <>Loading...</>
   }
   if (!currentEvent) {
      return <>Loading...</>
   }

   const renderMarkContent = (criteriaId: number, index: number) => {
      switch (currentEvent.markStrategyId) {
         case 2:
            return (
               <>
                  <input type='hidden' {...register(`marks.${index}.criteriaId`)} value={criteriaId} />
                  <select {...register(`marks.${index}.mark`, { required: true })} className='border border-solid border-black rounded-xl'>
                     <option value=''>Выберите оценку</option>
                     <option value={1}>Зачет</option>
                     <option value={0}>Незачет</option>
                  </select>
               </>
            )
         case 3:
            return (
               <>
                  <input type='hidden' {...register(`marks.${index}.criteriaId`)} value={criteriaId} />
                  <input className='border border-solid border-black text-sm' min={2} max={5} type='number'
                     {...register(`marks.${index}.mark`,
                        {
                           required: true,
                           min: 2,
                           max: 5
                        })}
                  />
               </>
            )
         default:
            return (
               <div>
                  Непонятно
               </div>
            )
      }
   }

   return (
      <>
         <Title text={currentTeam.name} />

         <div className='text-black text-xl font-bold font-sans my-5'>Ответ команды</div>
         {currentAnswer ? <div className='text-black text-base font-normal font-inter mt-5'>{currentAnswer.text}</div>
            : (<div className='text-black text-base font-normal font-inter mt-5'>Команда не прислала ответа</div>)}

         {currentAnswer && (
            <form onSubmit={handleSubmit(onSubmit)}>
               {currentEvent.criteriasNames.length === 0
                  ? (
                     <>
                        <div className='text-black text-xl font-bold font-sans my-5'>Общая оценка</div>
                        <div className='flex justify-between items-center gap-16 w-96 mb-5'>
                           <div className='font-normal font-inter text-base text-black'>Общая оценка</div>
                           <div> {renderMarkContent(0, 0)} </div>
                        </div>
                     </>
                  )
                  : (
                     <>
                        <div className='text-black text-xl font-bold font-sans my-5'>Критерии</div>
                        {currentEvent.criteriasNames.map((criteriaName, index) => (
                           <div className='flex justify-between items-center gap-16 w-96 mb-5' key={currentEvent.criterias && currentEvent.criterias[index]}>
                              <div className='font-normal font-inter text-base text-black'>{criteriaName}</div>
                              <div> {renderMarkContent(currentEvent.criterias[index], index)} </div>
                           </div>
                        ))}
                     </>
                  )
               }

               <div className='text-black text-xl font-bold font-sans my-5'>Комментарий</div>
               <textarea className='border border-solid border-gray rounded-xl h-36 w-96 p-3 font-sans text-sm' placeholder='Введите комментарий' {...register('comment')} />

               <div className='flex gap-3 mt-3'>
                  <button type="button" onClick={() => navigate(-1)} className='font-bold font-inter py-3 px-5 rounded-xl text-black bg-another_white'>Отмена</button>
                  <button type="submit" className='font-bold font-inter py-3 px-5 rounded-xl text-white bg-blue'>Отправить ответ</button>
               </div>
            </form>
         )}
      </>
   )
}

export default TeamEvaluationPage