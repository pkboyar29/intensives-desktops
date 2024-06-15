import { FC, useContext } from 'react'
import { EducationRequestsContext } from '../../context/EducationRequestsContext'
import { useParams } from 'react-router-dom'

import Title from '../../components/Title/Title'
import { EducationRequest } from '../../utils/types/EducationRequest'

const EducationRequestOverviewPage: FC = () => {

   const educationRequests: EducationRequest[] = useContext(EducationRequestsContext)
   const params = useParams()
   const currentRequest: EducationRequest | undefined = educationRequests.find((request: EducationRequest) => request.id === Number(params.requestId))

   return (
      <>
         <Title text='Просмотр образовательного запроса' />

         <div className='overview__container'>
            <div className='overview__item'>
               <h2 className='mini-title'>Тема запроса</h2>
               <div className='overview__content'>{currentRequest?.subject}</div>
            </div>
            <div className='overview__item'>
               <h2 className='mini-title'>Описание запроса</h2>
               <div className='overview__content'>{currentRequest?.descr}</div>
            </div>
            <div className='overview__item'>
               <h2 className='mini-title'>Команда</h2>
               <div className='overview__content'>{currentRequest?.teamName}</div>
            </div>
            <div className='overview__item'>
               <h2 className='mini-title'>Владелец запроса</h2>
               <div className='overview__content'>{currentRequest?.ownerName}</div>
            </div>
            <div className='overview__item'>
               <h2 className='mini-title'>Дата создания запроса</h2>
               <div className='overview__content'>{currentRequest?.createdDate.toLocaleDateString()}</div>
            </div>
         </div>
      </>
   )
}

export default EducationRequestOverviewPage