import './App.css'
import { FC } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'

import NotFoundPage from '../pages/NotFoundPage/NotFoundPage'
import SignInPage from '../pages/SignInPage/SignInPage'
import Header from '../components/Header/Header'
import IntensivesPage from '../pages/IntensivesPage/IntensivesPage'
import IntensivePage from '../pages/IntensivePage/IntensivePage'
import IntensiveEducationRequestsPage from '../pages/IntensiveEducationRequestsPage/IntensiveEducationRequestsPage'
import IntensiveEventsPage from '../pages/IntensiveEventsPage/IntensiveEventsPage'
import IntensiveOverviewPage from '../pages/IntensiveOverviewPage/IntensiveOverviewPage'
import IntensiveTeamsPage from '../pages/IntensiveTeamsPage/IntensiveTeamsPage'
import IntensiveEducationRequestOverviewPage from '../pages/IntensiveEducationRequestOverviewPage/IntensiveEducationRequestOverviewPage'

import AppProviders from './AppProviders'

const App: FC = () => {

  return (
    <div className='App'>
      <AppProviders>
        <Header />
        <Routes>
          <Route path='/intensive/:intensiveId' element={<IntensivePage />}>
            <Route path='overview' element={<IntensiveOverviewPage />} />
            <Route path='teams' element={<IntensiveTeamsPage />} />
            <Route path='events' element={<IntensiveEventsPage />} />
            <Route path='education-requests' element={<IntensiveEducationRequestsPage />} />
            <Route path='education-requests/:requestId' element={<IntensiveEducationRequestOverviewPage />} />
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