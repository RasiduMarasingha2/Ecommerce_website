import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout.jsx'
import './App.css'
import Home from './pages/Home.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import UserDashboard from './pages/customer/UserDashboard.jsx'
import { Toaster } from 'sonner'
import AdminRoute from './components/routes/AdminRoute.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import AdminLogin from './pages/auth/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminProducts from './pages/admin/AdminProducts.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import AdminOrders from './pages/admin/AdminOrders.jsx'
import AdminOffers from './pages/admin/AdminOffers.jsx'
import AdminTheme from './pages/admin/AdminTheme.jsx'
import AdminContent from './pages/admin/AdminContent.jsx'

// Seller Imports
import SellerRoute from './components/routes/SellerRoute.jsx'
import SellerLayout from './components/Layout/SellerLayout.jsx'
import SellerDashboard from './pages/seller/SellerDashboard.jsx'
import SellerProducts from './pages/seller/SellerProducts.jsx'
import SellerOrders from './pages/seller/SellerOrders.jsx'
import SellerProfile from './pages/seller/SellerProfile.jsx'
import RegisterSeller from './pages/RegisterSeller.jsx'
const App = () => {
 
  return (
   
   <BrowserRouter>
   <Toaster position="top-right" richColors />
     <Routes>
       <Route path="/" element={<UserLayout />} >
         <Route index element={<Home />} />
         <Route path="/product/:id" element={<ProductDetails />} />
         <Route path="/user" element={<UserDashboard />} />
       </Route>
       <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />
       <Route path="/register-seller" element={<RegisterSeller />} />
       <Route path="/forgot-password" element={<ForgotPassword />} />
       <Route path="/admin/login" element={<AdminLogin />} />
       <Route element={<AdminRoute />}>
           <Route path="/admin" element={<AdminLayout />}>
               <Route index element={<AdminDashboard />} />
               <Route path="dashboard" element={<AdminDashboard />} />
               <Route path="products" element={<AdminProducts />} />
               <Route path="users" element={<AdminUsers />} />
               <Route path="orders" element={<AdminOrders />} />
               <Route path="offers" element={<AdminOffers />} />
               <Route path="theme" element={<AdminTheme />} />
               <Route path="content" element={<AdminContent />} />
           </Route>
       </Route>

       {/* Protected Seller Routes */}
       <Route path="/seller" element={<SellerRoute />}>
         <Route element={<SellerLayout />}>
           <Route path="dashboard" element={<SellerDashboard />} />
           <Route path="products" element={<SellerProducts />} />
           <Route path="orders" element={<SellerOrders />} />
           <Route path="profile" element={<SellerProfile />} />
         </Route>
       </Route>
    </Routes>

   </BrowserRouter>
   
  )
}

export default App;
