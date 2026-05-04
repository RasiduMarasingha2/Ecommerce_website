import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout.jsx'
import './App.css'


function App() {
 
  return (
   
   <BrowserRouter>
     <Routes>
       <Route path="/" element={<UserLayout />} />
       {/* usetr */ }
     </Routes>

   </BrowserRouter>
  )
}

export default App;
