import './App.css'
import { FC } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'


import NotFoundPage from '../pages/NotFoundPage/NotFoundPage'
import SignInPage from '../pages/SignInPage/SignInPage'
import Header from '../components/Header/Header'
import IntensivesPage from '../pages/IntensivesPage/IntensivesPage'
import IntensivePage from '../pages/IntensivePage/IntensivePage'

const App: FC = () => {
  return (
    <div className='App'>
      <Header />

      <Routes>
        <Route path='/intensive' element={<IntensivePage />}>

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