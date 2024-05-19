import './App.css'
import { FC } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'


import NotFoundPage from '../pages/NotFoundPage/NotFoundPage'
import SignInPage from '../pages/SignInPage/SignInPage'

const App: FC = () => {
  return (
    <div className='App'>
      <Routes>
        <Route path='/sign-in' element={<SignInPage />} />
        <Route path='/' element={<Navigate to='/sign-in' />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App