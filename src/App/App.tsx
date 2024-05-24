import './App.css'
import { FC, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import axios from 'axios'

import AppProviders from './AppProviders'

import NotFoundPage from '../pages/NotFoundPage/NotFoundPage'
import SignInPage from '../pages/SignInPage/SignInPage'
import Header from '../components/Header/Header'
import IntensivesPage from '../pages/IntensivesPage/IntensivesPage'
import IntensivePage from '../pages/IntensivePage/IntensivePage'
import EducationRequestsPage from '../pages/EducationRequestsPage/EducationRequestsPage'
import EventsPage from '../pages/EventsPage/EventsPage'
import IntensiveOverviewPage from '../pages/IntensiveOverviewPage/IntensiveOverviewPage'
import TeamsPage from '../pages/TeamsPage/TeamsPage'
import EducationRequestOverviewPage from '../pages/EducationRequestOverviewPage/EducationRequestOverviewPage'
import EventOverviewPage from '../pages/EventOverviewPage/EventOverviewPage'

const App: FC = () => {

  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URL + 'intensives/')
      .then(response => console.log(response.data))
  })

  return (
    <div className='App'>
      <AppProviders>
        <Header />
        <Routes>
          <Route path='/intensive/:intensiveId' element={<IntensivePage />}>
            <Route path='overview' element={<IntensiveOverviewPage />} />
            <Route path='teams' element={<TeamsPage />} />
            <Route path='events' element={<EventsPage />} />
            <Route path='events/:eventId' element={<EventOverviewPage />} />
            <Route path='education-requests' element={<EducationRequestsPage />} />
            <Route path='education-requests/:requestId' element={<EducationRequestOverviewPage />} />
          </Route>
          <Route path='/intensives' element={<IntensivesPage />} />
          <Route path='/sign-in' element={<SignInPage />} />
          <Route path='/' element={<Navigate to='/sign-in' />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </AppProviders>
    </div>
  )
}

export default App