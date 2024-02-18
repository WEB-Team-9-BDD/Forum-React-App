import { useEffect, useState } from 'react'
import { AppContext } from './context/AppContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Authenticated from './hoc/Authenticated.jsx'
import Home from './views/Home/Home'
import Header from './components/Header/Header'
import Login from './views/Login/Login'
import CreateAccount from './views/CreateAccount/CreateAccount'
import Loader from './components/Loader/Loader'
import AdminPowers from './views/Admin/AdminPowers'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './config/firebase-config'
import { Toaster } from 'react-hot-toast'
import { getUserData } from './services/users.service'
import ForgotPassword from './components/ForgotPassword/ForgotPassword'
import UpdateAccount from './views/UpdateProfile/UpdateAccount'
import Sidebar from './components/Sidebar/Sidebar'
import { postCategories } from './constants/postCategories.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import AllPosts from './views/Posts/AllPosts'
import SinglePost from './views/Posts/SinglePost'
import CreatePost from './views/Posts/CreatePost'
import PersonalProfile from './views/PersonalProfile/PersonalProfile.jsx'


function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [user, loading, error] = useAuthState(auth);
  const [showSidebar, setShowSidebar] = useState(false);
  const [categories, setCategories] = useState(postCategories);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  }

  useEffect(() => {
    if (user) {

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
          <Toaster />
          <Header toggle={toggleSidebar} />
          <Sidebar categories={categories} isOpen={showSidebar} />
          <div className={showSidebar ? 'main-content' : 'sidebar-open'} >
            <Routes>
              <Route index element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/create-account' element={<CreateAccount />} />
              <Route path='/posts' element={<Authenticated><AllPosts /></Authenticated>} />
              <Route path='/posts/:id' element={<Authenticated><SinglePost /></Authenticated>} />
              <Route path='/post-create' element={<Authenticated><CreatePost /></Authenticated>} />
              <Route path='/user-profile' element={<Authenticated><PersonalProfile /></Authenticated>} />
              <Route path='/update-profile' element={<Authenticated><UpdateAccount /></Authenticated>} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/admin-powers' element={<Authenticated><AdminPowers /></Authenticated>} />

            </Routes>
          </div>
        </AppContext.Provider>
      </BrowserRouter >
    </>
  );
}

export default App
