import './App.css'
import { FC } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Intensive } from '../utils/types/Intensive'


import NotFoundPage from '../pages/NotFoundPage/NotFoundPage'
import SignInPage from '../pages/SignInPage/SignInPage'
import Header from '../components/Header/Header'
import IntensivesPage from '../pages/IntensivesPage/IntensivesPage'
import IntensivePage from '../pages/IntensivePage/IntensivePage'
import IntensiveEducationRequestsPage from '../pages/IntensiveEducationRequestsPage/IntensiveEducationRequestsPage'
import IntensiveEventsPage from '../pages/IntensiveEventsPage/IntensiveEventsPage'
import IntensiveOverviewPage from '../pages/IntensiveOverviewPage/IntensiveOverviewPage'
import IntensiveTeamsPage from '../pages/IntensiveTeamsPage/IntensiveTeamsPage'
import IntensiveContextProvider from '../context/IntensivesContext'

const App: FC = () => {

  const intensives: Intensive[] = [
    {
      id: 1,
      name: "Веб-разработка",
      descr: "Интенсив по современным технологиям веб-разработки.",
      openDate: new Date('2024-06-01'),
      closeDate: new Date('2024-07-01'),
      flow: "Поток 20-ИCбо"
    },
    {
      id: 2,
      name: "Погружение в бэк-разработку",
      descr: "Интенсив по созданию серверных приложений и API.",
      openDate: new Date('2024-07-05'),
      closeDate: new Date('2024-08-05'),
      flow: "Поток 20-ИCбо"
    },
    {
      id: 3,
      name: "Разработка игр",
      descr: "Интенсив по разработке компьютерных игр с использованием Unity и Unreal Engine.",
      openDate: new Date('2024-08-10'),
      closeDate: new Date('2024-09-10'),
      flow: "Поток 20-ИCбо"
    },
    {
      id: 4,
      name: "Мобильная разработка",
      descr: "Интенсив по созданию мобильных приложений для iOS и Android.",
      openDate: new Date('2024-09-15'),
      closeDate: new Date('2024-10-15'),
      flow: "Поток 20-ИCбо"
    },
    {
      id: 5,
      name: "Дизайн и UX",
      descr: "Интенсив по основам дизайна и пользовательского опыта.",
      openDate: new Date('2024-10-20'),
      closeDate: new Date('2024-11-20'),
      flow: "Поток 20-ИCбо"
    }
  ]

  return (
    <div className='App'>
      <Header />

      <IntensiveContextProvider intensives={intensives}>
        <Routes>
          <Route path='/intensive/:intensiveId' element={<IntensivePage />}>
            <Route path='overview' element={<IntensiveOverviewPage />} />
            <Route path='teams' element={<IntensiveTeamsPage />} />
            <Route path='events' element={<IntensiveEventsPage />} />
            <Route path='education-requests' element={<IntensiveEducationRequestsPage />} />
          </Route>
          <Route path='/intensives' element={<IntensivesPage />} />
          <Route path='/sign-in' element={<SignInPage />} />
          <Route path='/' element={<Navigate to='/sign-in' />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </IntensiveContextProvider>
    </div>
  )
}

export default App