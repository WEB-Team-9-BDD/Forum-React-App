import { useEffect, useState } from 'react'
import { AppContext } from './context/AppContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './views/Home/Home'
import Header from './components/Header/Header'
import Login from './views/Login/Login'
import CreateAccount from './views/CreateAccount/CreateAccount'
import Loader from './components/Loader/Loader'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './config/firebase-config'
import { Toaster } from 'react-hot-toast'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

import { getUserData } from './services/users.service'
function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [user, loading, error] = useAuthState(auth);

  // if (error) {
  //   return <Toaster position="top-center"/>
  // }

  useEffect(() => {
    if (user) {
      setAppState({ user, userData: null });

      getUserData(user.uid)
        .then(snapshot => {
          if (snapshot.exists()) {

            setAppState({ user, userData: snapshot.val()[Object.keys(snapshot.val())[0]] });
          }
        })
    }
  }, [user]);

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <BrowserRouter>
        <AppContext.Provider value={{ ...appState, setAppState }}>
          <Toaster/>
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
