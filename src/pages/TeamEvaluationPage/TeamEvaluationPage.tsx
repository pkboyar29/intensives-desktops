import { FC, useEffect, useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useForm } from 'react-hook-form'

import { TeamsContext } from '../../context/TeamsContext'
import { EventsContext } from '../../context/EventsContext'
import { CurrentUserContext } from '../../context/CurrentUserContext'

import './TeamEvaluationPage.css'
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
      const studentsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/role_of_students_on_intensives/`)
      const allStudents = studentsResponse.data.results
      const currentTeamStudents = allStudents.filter((student: any) => {
         if (params.teamId) {
            return student.command === parseInt(params.teamId, 10)
         }
      })
      const answersResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/answers/`)
      const allAnswers = answersResponse.data.results
      const currentEventAnswers = allAnswers.filter((answer: any) => {
         if (params.eventId) {
            return answer.event === parseInt(params.eventId, 10)
         }
      })
      const currentTeamAnswer = currentEventAnswers.find((answer: any) => currentTeamStudents.some((student: any) => answer.student === student.id))
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
         case 1:
            return (
               <>
                  <input type='hidden' {...register(`marks.${index}.criteriaId`)} value={criteriaId} />
                  <select {...register(`marks.${index}.mark`, { required: true })} className='evaluation__select'>
                     <option value=''>Выберите оценку</option>
                     <option value={1}>Зачет</option>
                     <option value={0}>Незачет</option>
                  </select>
               </>
            )
         case 2:
            return (
               <>
                  <input type='hidden' {...register(`marks.${index}.criteriaId`)} value={criteriaId} />
                  <input className='evaluation__input' min={2} max={5} type='number'
                     {...register(`marks.${index}.mark`,
                        {
                           required: true,
                           min: 2,
                           max: 5
                        })}
                  />
               </>
            )
         case 3:
            return (
               <>
                  <>
                     <input type='hidden' {...register(`marks.${index}.criteriaId`)} value={criteriaId} />
                     <input className='evaluation__input' min={0} max={100} type='number'
                        {...register(`marks.${index}.mark`,
                           {
                              required: true,
                              min: 0,
                              max: 100
                           })}
                     />
                  </>
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

         <div className='evaluation__subtitle'>Ответ команды</div>
         {currentAnswer ? <div className='evaluation__text'>{currentAnswer.text}</div>
            : (<div className='evaluation__text'>Команда не прислала ответа</div>)}

         {currentAnswer && (
            <form onSubmit={handleSubmit(onSubmit)}>
               {currentEvent.criteriasNames.length === 0
                  ? (
                     <>
                        <div className='evaluation__subtitle'>Общая оценка</div>
                        <div className='criteria'>
                           <div className='criteria__text'>Общая оценка</div>
                           <div className='criteria__mark'>
                              {renderMarkContent(0, 0)}
                           </div>
                        </div>
                     </>
                  )
                  : (
                     <>
                        <div className='evaluation__subtitle'>Критерии</div>
                        {currentEvent.criteriasNames.map((criteriaName, index) => (
                           <div className='criteria' key={currentEvent.criterias && currentEvent.criterias[index]}>
                              <div className='criteria__text'>{criteriaName}</div>
                              <div className='criteria__mark'>
                                 {renderMarkContent(currentEvent.criterias[index], index)}
                              </div>
                           </div>
                        ))}
                     </>
                  )
               }

               <div className='evaluation__subtitle'>Комментарий</div>
               <textarea className='evaluation__textarea' placeholder='Введите комментарий' {...register('comment')} />

               <div className='evaluation__buttons'>
                  <button type="button" onClick={() => navigate(-1)} className='evaluation__button evaluation__cancel'>Отмена</button>
                  <button type="submit" className='evaluation__button evaluation__save'>Отправить ответ</button>
               </div>
            </form>
         )}
      </>
   )
}

export default TeamEvaluationPage