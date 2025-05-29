import { useState , useEffect } from 'react'
import { BrowserRouter , Routes , Route, Navigate } from 'react-router-dom'
import Login from './screen/Login'
import Home from './screen/Home'
import Signup from './screen/Signup'
import Profile from './screen/Profile'
import { FetchProvider, useFetch } from './context/Fetching'
import Navbar from './components/Navbar'

function App() {
  const {token} = useFetch();
  return (
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
          <Route path="/signup" element={token ? <Navigate to="/" /> : <Signup />} />
          <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
          <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
