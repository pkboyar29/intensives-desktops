import SideMenu from '../components/SideMenu'
import { useEffect, useState } from 'react'
import PostService from '../API/PostService'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from 'react-router-dom'
import { convertBackDateFormat, formatDate } from '../utils'

const Intensiv = () => {
  const [data, setData] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = Number(localStorage.getItem('id'));
        await PostService.getIntensiv(id).then((res) => {
          setData(res.data)
        })
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className='body'>
      <SideMenu />
      <div className='main-block'>
        <div className='center-block'>
          <div className='list-content column-container'>
            <div className='title'>
              {data ? (
                <div className='font-32'>{data?.name}</div>
              ) : (
                <Skeleton></Skeleton>
              )}
            </div>
            <div className='column-container'>
              <div className='element-list-input'>
                <div className='font-18 bold-font'>{
                  (data) ?
                    (formatDate(convertBackDateFormat(data?.created_at))) +
                    ' - ' +
                    (formatDate(convertBackDateFormat(data?.close_dt)) || 'дата окончания не проставлена')
                    : null
                }
                </div>
              </div>

              <div className='element-list-input'>
                {data ? (
                  <div className='font-18'>{data.description}</div>
                ) : (
                  <Skeleton></Skeleton>
                )}
              </div>
              <div className='element-list-input'>
                <div className='font-18 bold-font'>Участники</div>
              </div>
              <div className='element-list-input column-container'>
                <div>Список учебных потоков</div>
                <div className='flex flex-wrap'>
                  {data ? (
                    data.flow.map((elem) => (
                      <div className='ml-4 text-sm selectedInList'>{elem}</div>
                    ))
                  ) : (
                    <Skeleton></Skeleton>
                  )}
                </div>
                <div className='element-list-input column-container'>
                  <div className=''>Список ролей для студентов</div>
                  <div className='flex flex-wrap'>
                    {data ? (
                      data.roles.map((elem) => (
                        <div className='ml-4 text-sm selectedInList'>{elem}</div>
                      ))
                    ) : (
                      <Skeleton></Skeleton>
                    )}
                  </div>
                </div>
                <div className='element-list-input column-container'>
                  <div className=''>Список преподавателей</div>
                  <div className='flex flex-wrap'>
                    {data ? (
                      data.teacher_command.lenght ? (
                        data.teacher_command.map((elem) => (
                          <div className='ml-4 text-sm selectedInList'>{elem}</div>
                        ))
                      ) : (
                        <div>Преподаватели не выбраны</div>
                      )
                    ) : (
                      <Skeleton></Skeleton>
                    )}
                  </div>
                </div>
                <div className='element-list-input flex justify-between'>
                  <button className='button-classic w-100'><Link to='/createIntensive'>Редактировать</Link></button>
                  <button className='button-ser' onClick={() => {
                    PostService.deleteIntensiv(localStorage.getItem('id'))
                    window.location.href = '/intensives'
                  }}>Удалить</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Intensiv }