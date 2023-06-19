import { Outlet, Routes, Route } from 'react-router-dom'
import Google from './views/Google'
import './App.css'

export default function App() {

  return (
    <>
      <Routing />
      <Outlet />
    </>
  )
}

function Routing() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/google" element={<Google />} />
      </Routes>
    </>
  )
}


function Home() {

  const googleLogin = () => {
    let endpoint = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    endpoint.searchParams.set("client_id", "277508119822-7oggtss40ulq7l01ajr9kbkk2o2nag69.apps.googleusercontent.com");
    endpoint.searchParams.set("redirect_uri", "http://localhost:5173/google");
    endpoint.searchParams.set("scope", "email openid profile");
    endpoint.searchParams.set("response_type", "token");
    endpoint.searchParams.set("state", "send-data-here");
    window.location.href = endpoint
  }

  return (
    <>
      <button onClick={googleLogin}>Google Login</button>
    </>
  )
}


