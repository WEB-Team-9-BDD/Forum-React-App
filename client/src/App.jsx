import { useEffect, useState } from 'react'
import './App.css'
import Home from './views/Home/Home'
import Header from './components/Header/Header'
import { AppContext } from './context/AppContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './views/Login/Login'
import CreateAccount from './views/CreateAccount/CreateAccount'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './config/firebase-config'
import Loader from './components/Loader/Loader'

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      setAppState({ user, userData: null });
    }
  }, [user]);

  // if(loading) {
  //   setTimeout(() => {
  //     <Loader/>  
  //   }, 500);
  //    return    
  // }




  return (
    <>
      <BrowserRouter>
        <AppContext.Provider value={{ ...appState, setAppState }}>
          <Header />
          <Routes>
            <Route index element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/create-account' element={<CreateAccount />} />
          </Routes>
        </AppContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App
