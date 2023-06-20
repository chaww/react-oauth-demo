import { Outlet, Routes, Route } from 'react-router-dom'
import Nav from './views/Nav';
import Google from './views/Google'
import './App.css'


export default function App() {

  return (
    <>
      <Nav/>
      <Routing />
      <Outlet />
    </>
  )
}

function Routing() {
  return (
    <>
      <Routes>
        <Route path='/google' element={<Google />} />
      </Routes>
    </>
  )
}


