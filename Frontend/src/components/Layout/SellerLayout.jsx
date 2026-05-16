import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiBox, FiUsers, FiSettings, FiLogOut, FiMenu, FiX, FiShoppingCart, FiMessageSquare, FiDollarSign } from 'react-icons/fi';
import axiosClient from '../../api/axiosClient';
import { toast } from 'sonner';

const SellerLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);

    const menuItems = [
        { title: 'Dashboard', icon: <FiHome size={20} />, path: '/seller/dashboard' },
        { title: 'My Products', icon: <FiBox size={20} />, path: '/seller/products' },
        { title: 'Orders', icon: <FiShoppingCart size={20} />, path: '/seller/orders' },
        { title: 'Store Profile', icon: <FiSettings size={20} />, path: '/seller/profile' }
    ];

    const handleLogout = async () => {
        try {
            await axiosClient.post('/auth/logout');
            dispatch(logout());
            toast.success('Logged out successfully');
            navigate('/'); // Redirect to normal site
        } catch (error) {
            toast.error('Failed to log out');
        }
    };

    return (
        <div className="flex h-screen bg-black overflow-hidden font-sans text-white">
            {/* Sidebar */}
            <motion.aside 
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                className="h-full bg-[#0a0a0a] border-r border-gray-800 shadow-2xl z-20 relative hidden md:flex flex-col"
            >
                <div className="p-6 flex items-center justify-between border-b border-gray-800">
                    <Link to="/" className="text-2xl font-black tracking-tight whitespace-nowrap text-white">
                        {isSidebarOpen ? <><span className="text-white">LU</span><span className="text-[#008000]">V</span><span className="text-white">ION</span></> : <><span className="text-white">L</span><span className="text-[#008000]">V</span></>}
                    </Link>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-300 hover:text-white transition-colors">
                        <FiMenu size={24} />
                    </button>
                </div>

                <div className="flex-1 mt-6 px-4 space-y-2">
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={index}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-[#008000]/10 text-[#008000] border-r-4 border-[#008000]' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                                title={!isSidebarOpen ? item.title : ''}
                            >
                                <span className={`${isActive ? 'text-[#008000]' : 'text-gray-400'}`}>{item.icon}</span>
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span 
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="ml-4 font-bold whitespace-nowrap"
                                        >
                                            {item.title}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center p-3 rounded-xl text-red-500 hover:bg-gray-800 hover:text-white transition-all duration-300 font-bold"
                        title={!isSidebarOpen ? 'Logout' : ''}
                    >
                        <FiLogOut size={20} />
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.span 
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="ml-4 font-bold whitespace-nowrap"
                                >
                                    Logout
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-20 bg-[#0a0a0a] shadow-sm flex items-center justify-between px-8 z-10 border-b border-gray-800">
                    <h1 className="text-2xl font-black text-white capitalize">
                        {location.pathname.split('/').pop().replace('-', ' ')}
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800">
                            <span className="text-xs font-bold text-gray-400">Seller ID:</span>
                            <code className="text-sm font-mono font-bold text-[#008000]">#{userInfo?.accountId || userInfo?._id?.slice(-5).toUpperCase()}</code>
                        </div>
                        <button onClick={handleLogout} className="md:hidden text-gray-500 hover:text-red-500">
                            <FiLogOut size={24} />
                        </button>
                    </div>
                </header>

                {/* Main Scrollable View */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="h-full"
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default SellerLayout;
