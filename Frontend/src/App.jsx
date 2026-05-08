import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout.jsx'
import './App.css'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import { Toaster } from 'sonner'




const App = () => {
 
  return (
   
   <BrowserRouter>
   <Toaster position="top-right" richColors />
     <Routes>
       <Route path="/" element={<UserLayout />} >
         <Route index element={<Home />} />
       </Route>
       <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />
       <Route>{/* Admin Layout */}</Route>
    </Routes>

   </BrowserRouter>
   
  )
}

export default App;
