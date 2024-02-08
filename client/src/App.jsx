import { useState } from 'react'
import './App.css'
import Home from './views/Home/Home'
import {AppContext} from './context/AppContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  })

  return (
    <>
      <BrowserRouter>
        <AppContext.Provider value={{ ...appState, setAppState }}>
          <Routes>
            <Route path='/' element={<Home />} />
          </Routes>
        </AppContext.Provider>
      </BrowserRouter>
    </>
  )
}

export default App
