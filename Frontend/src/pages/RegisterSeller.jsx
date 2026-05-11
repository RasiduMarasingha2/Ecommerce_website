import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import axiosClient from '../api/axiosClient';
import { toast } from 'sonner';

const RegisterSeller = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [storeName, setStoreName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const { data } = await axiosClient.post('/auth/register-seller', { name, email, password, phone, storeName });
        dispatch(setCredentials(data));
        toast.success('Seller account created! Welcome aboard.');
        navigate('/seller/dashboard'); // Immediately redirect to seller dashboard
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to register as seller');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#000033] to-black relative overflow-hidden font-sans py-12">
      
      {/* Subtle Grid Overlay on Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-screen pointer-events-none"></div>

      {/* Back to Home Button */}
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 z-50 flex items-center text-gray-400 hover:text-white transition-colors group"
      >
        <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        <span className="font-medium text-sm">Back to Home</span>
      </motion.button>
      
      {/* Glowing Frame Wrapper */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md z-10 p-[3px] rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,255,0.1)]"
      >
        {/* Animated Gradient Border (Blue for sellers) */}
        <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute inset-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_280deg,#3b82f6_360deg)] opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/20 via-transparent to-blue-500/20 blur-xl"></div>
        <div className="absolute inset-0 rounded-[2rem] border border-gray-200"></div>

        {/* Inner Glass Card */}
        <div className="relative w-full h-full p-10 bg-white/90 backdrop-blur-2xl rounded-[calc(2rem-3px)]">
            <div className="text-center mb-10">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 p-[2px]"
                >
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-inner">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </div>
                </motion.div>
                <h2 className="text-3xl font-black text-black tracking-tight">Become a Seller</h2>
                <p className="text-gray-500 mt-2 text-sm font-medium">Start your business journey today.</p>
            </div>

            <form onSubmit={submitHandler} className="space-y-5">
            <div>
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="Full Name"
                    required
                />
            </div>
            <div>
                <input 
                    type="text" 
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="Store/Shop Name"
                    required
                />
            </div>
            <div>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="Email ID"
                    required
                />
            </div>
            <div>
                <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="Phone Number (+94 7X XXX XXXX)"
                    required
                />
            </div>
            <div>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="Password"
                    required
                />
            </div>

            <motion.button 
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 mt-6 rounded-xl bg-black text-white font-bold hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300 disabled:opacity-50 flex justify-center items-center"
            >
                {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : 'Open Store'}
            </motion.button>
            </form>

            <p className="mt-8 text-center text-sm font-medium text-gray-600">
                Already have a seller account? <a href="/login" className="text-blue-600 font-bold hover:underline transition-colors">Sign In</a>
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterSeller;
