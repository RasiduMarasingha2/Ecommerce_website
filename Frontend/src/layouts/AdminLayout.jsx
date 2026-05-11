import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { motion } from 'framer-motion';
import { 
    FiHome, FiUsers, FiShoppingBag, 
    FiList, FiSettings, FiLayout, 
    FiLogOut, FiMenu, FiBell, FiGift
} from 'react-icons/fi';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: FiHome },
        { name: 'Products', path: '/admin/products', icon: FiShoppingBag },
        { name: 'Users', path: '/admin/users', icon: FiUsers },
        { name: 'Orders', path: '/admin/orders', icon: FiList },
        { name: 'Offers', path: '/admin/offers', icon: FiGift },
        { name: 'Content', path: '/admin/content', icon: FiLayout },
        { name: 'Theme', path: '/admin/theme', icon: FiSettings },
    ];

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            {/* Sidebar */}
            <motion.aside 
                initial={false}
                animate={{ width: sidebarOpen ? 256 : 80 }}
                className="bg-[#0a0a0a] border-r border-gray-800 flex flex-col transition-all duration-300"
            >
                <div className="h-16 flex items-center justify-center border-b border-gray-800">
                    <Link to="/" className="text-xl font-black text-white tracking-tighter">
                        {sidebarOpen ? <><span className="text-white">NEXT</span> <span className="text-[#008000]">GEN</span></> : <span className="text-[#008000]">NG</span>}
                    </Link>
                </div>
                
                <nav className="flex-1 py-4 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.name} 
                                to={item.path}
                                className={`flex items-center px-6 py-3 transition-colors ${isActive ? 'bg-[#008000]/10 border-r-4 border-[#008000] text-[#008000]' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                <span className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-2 py-2 text-red-500 hover:bg-gray-800 rounded-md transition-colors font-bold"
                    >
                        <FiLogOut className="w-5 h-5" />
                        <span className={`ml-4 whitespace-nowrap ${sidebarOpen ? 'block' : 'hidden'}`}>Logout</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="h-16 bg-[#0a0a0a] border-b border-gray-800 flex items-center justify-between px-6">
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-400 hover:text-white"
                    >
                        <FiMenu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-white relative">
                            <FiBell className="w-6 h-6" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-[#008000] rounded-full"></span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-[#008000] flex items-center justify-center text-sm font-bold text-white">
                            A
                        </div>
                    </div>
                </header>

                {/* Main scrollable area */}
                <main className="flex-1 overflow-y-auto p-6 bg-black custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
