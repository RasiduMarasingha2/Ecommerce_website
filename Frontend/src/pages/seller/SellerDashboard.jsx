import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerStats } from '../../redux/slices/sellerSlice';
import { motion } from 'framer-motion';
import { FiDollarSign, FiBox, FiEye, FiTrendingUp } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SellerDashboard = () => {
    const dispatch = useDispatch();
    const { stats, recentOrders, loading } = useSelector((state) => state.seller);

    useEffect(() => {
        dispatch(fetchSellerStats());
    }, [dispatch]);

    if (loading || !stats) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-gray-200 h-32 rounded-3xl"></div>
                ))}
            </div>
        );
    }

    const statCards = [
        { title: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: <FiDollarSign />, color: 'from-blue-400 to-blue-600' },
        { title: 'Total Sales', value: stats.totalSales, icon: <FiTrendingUp />, color: 'from-green-400 to-green-600' },
        { title: 'Total Products', value: stats.totalProducts, icon: <FiBox />, color: 'from-purple-400 to-purple-600' },
        { title: 'Total Views', value: stats.totalViews, icon: <FiEye />, color: 'from-orange-400 to-orange-600' }
    ];

    // Dummy data for charts
    const chartData = [
        { name: 'Mon', revenue: 400 }, { name: 'Tue', revenue: 300 },
        { name: 'Wed', revenue: 550 }, { name: 'Thu', revenue: 200 },
        { name: 'Fri', revenue: 700 }, { name: 'Sat', revenue: 850 },
        { name: 'Sun', revenue: 450 }
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-3xl bg-gradient-to-br ${card.color} text-white shadow-lg relative overflow-hidden`}
                    >
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-white/80 font-medium mb-1">{card.title}</p>
                                <h3 className="text-3xl font-black">{card.value}</h3>
                            </div>
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                {React.cloneElement(card.icon, { size: 24 })}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                >
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Revenue Overview</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} tickFormatter={(value) => `$${value}`} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                >
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Orders</h3>
                    <div className="space-y-4">
                        {recentOrders && recentOrders.length > 0 ? recentOrders.map((order) => (
                            <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                <div>
                                    <p className="font-bold text-gray-800">{order.user?.name}</p>
                                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-blue-600">${order.totalPrice.toFixed(2)}</p>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                        order.status === 'Processing' ? 'bg-orange-100 text-orange-600' :
                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-600' :
                                        'bg-green-100 text-green-600'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-center py-4">No recent orders found.</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SellerDashboard;
