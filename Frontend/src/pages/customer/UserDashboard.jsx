import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const UserDashboard = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    // Protect route
    React.useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
    }, [userInfo, navigate]);

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        navigate('/');
    };

    if (!userInfo) return null;

    const sidebarVariants = {
        hidden: { x: -50, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1 }
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
                
                {/* Sidebar */}
                <motion.div 
                    variants={sidebarVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full md:w-64 flex-shrink-0 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col h-fit"
                >
                    <div className="mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-black/20">
                            {userInfo.name.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-xl font-bold text-black">Hello, {userInfo.name}</h2>
                        <p className="text-sm text-gray-500">{userInfo.email}</p>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {[
                            { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                            { id: 'orders', label: 'My Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
                            { id: 'ai', label: 'AI Recommendations', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                            { id: 'settings', label: 'Account Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
                        ].map((item) => (
                            <motion.button
                                key={item.id}
                                variants={itemVariants}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                    activeTab === item.id 
                                        ? 'bg-black text-white shadow-md' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                                }`}
                            >
                                <svg className={`w-5 h-5 ${activeTab === item.id ? 'text-[#008000]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                </svg>
                                <span className="font-medium text-sm">{item.label}</span>
                            </motion.button>
                        ))}
                    </nav>

                    <motion.button
                        variants={itemVariants}
                        onClick={handleLogout}
                        className="mt-8 w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border-2 border-red-100 text-red-500 font-bold hover:bg-red-50 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span>Sign Out</span>
                    </motion.button>
                </motion.div>

                {/* Content Area */}
                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div key="overview" variants={contentVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
                                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#008000] rounded-full mix-blend-multiply filter blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                                    <h3 className="text-2xl font-black text-black mb-2">Welcome Back!</h3>
                                    <p className="text-gray-500">Track your orders, edit your profile, and see your personalized AI recommendations here.</p>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                                        <div>
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Orders</p>
                                            <p className="text-3xl font-black text-black">0</p>
                                        </div>
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                                        <div>
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Wishlist</p>
                                            <p className="text-3xl font-black text-black">0</p>
                                        </div>
                                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-400">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'orders' && (
                            <motion.div key="orders" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                    <h3 className="text-2xl font-black text-black mb-6">Order History</h3>
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                        </div>
                                        <p className="text-lg font-bold text-gray-400">No orders placed yet.</p>
                                        <button className="mt-4 px-6 py-2 bg-black text-white font-bold rounded-full hover:bg-[#008000] hover:shadow-[0_0_15px_rgba(0,128,0,0.4)] transition-all">Start Shopping</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'ai' && (
                            <motion.div key="ai" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                                <div className="bg-gradient-to-br from-black to-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-800 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#008000] rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse"></div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="w-12 h-12 bg-[#008000]/20 rounded-xl flex items-center justify-center border border-[#008000]/50">
                                                <svg className="w-6 h-6 text-[#008000]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                            </div>
                                            <h3 className="text-3xl font-black text-white">AI Engine</h3>
                                        </div>
                                        <p className="text-gray-400 font-medium mb-8 max-w-lg">Unlock the power of SWI-Prolog. Answer a few quick questions and let our logical inference engine find the perfect products tailored exactly for your needs.</p>
                                        
                                        <button className="px-8 py-4 bg-[#008000] text-white font-black rounded-xl hover:shadow-[0_0_30px_rgba(0,128,0,0.6)] transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2">
                                            <span>Configure My Preferences</span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div key="settings" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                    <h3 className="text-2xl font-black text-black mb-6">Account Settings</h3>
                                    <form className="space-y-6 max-w-xl">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                            <input type="text" defaultValue={userInfo.name} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#008000] focus:border-transparent outline-none transition-all text-black" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                            <input type="email" defaultValue={userInfo.email} disabled className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                            <input type="tel" placeholder="+94 7X XXX XXXX" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#008000] focus:border-transparent outline-none transition-all text-black" />
                                        </div>
                                        <button type="button" className="px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-[#008000] hover:shadow-[0_0_20px_rgba(0,128,0,0.4)] transition-all">Save Changes</button>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
};

export default UserDashboard;
