import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from '@mui/material'
import { SignIn } from './components/auth/sign-in'

function App() {

  return (
    <div className="flex justify-center items-center min-h-screen">
    <SignIn />
    </div>
  )
}

export default App
