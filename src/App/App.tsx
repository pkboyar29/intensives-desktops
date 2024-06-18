import { FC, useEffect, useContext } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { CurrentUserContext } from '../context/CurrentUserContext'

import NotFoundPage from '../pages/NotFoundPage/NotFoundPage'
import SignInPage from '../pages/SignInPage/SignInPage'
import Header from '../components/Header/Header'
import IntensivesPage from '../pages/IntensivesPage/IntensivesPage'
import TeacherMainPage from '../pages/TeacherMainPage/TeacherMainPage'
// import EducationRequestsPage from '../pages/EducationRequestsPage/EducationRequestsPage'
import EventsPage from '../pages/EventsPage/EventsPage'
import IntensiveOverviewPage from '../pages/IntensiveOverviewPage/IntensiveOverviewPage'
import TeamsPage from '../pages/TeamsPage/TeamsPage'
// import EducationRequestOverviewPage from '../pages/EducationRequestOverviewPage/EducationRequestOverviewPage'
import EventOverviewPage from '../pages/EventOverviewPage/EventOverviewPage'
import TeamEvaluationPage from '../pages/TeamEvaluationPage/TeamEvaluationPage'

const App: FC = () => {
  const { updateCurrentUser } = useContext(CurrentUserContext)

  useEffect(() => {
    updateCurrentUser()
  }, [])

  return (
    <div className='App'>
      <Header />
      <Routes>
        <Route path='/teacher/:intensiveId' element={<TeacherMainPage />}>
          <Route path='overview' element={<IntensiveOverviewPage />} />
          <Route path='teams' element={<TeamsPage />} />
          <Route path='events' element={<EventsPage />} />
          <Route path='events/:eventId' element={<EventOverviewPage />} />
          <Route path='team-evaluation/:eventId/:teamId' element={<TeamEvaluationPage />} />
          {/* <Route path='education-requests' element={<EducationRequestsPage />} />
          <Route path='education-requests/:requestId' element={<EducationRequestOverviewPage />} /> */}
        </Route>
        <Route path='/intensives' element={<IntensivesPage />} />
        <Route path='/sign-in' element={<SignInPage />} />
        <Route path='/' element={<Navigate to='/sign-in' />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App