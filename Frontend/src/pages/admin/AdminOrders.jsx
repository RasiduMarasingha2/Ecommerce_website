import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiPackage, FiTruck, FiCheck, FiX } from 'react-icons/fi';
import axios from '../../api/axiosClient';
import { toast } from 'sonner';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/admin/orders');
            setOrders(data);
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`/admin/orders/${id}/status`, { status: newStatus });
            toast.success(`Order marked as ${newStatus}`);
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const filteredOrders = orders.filter(o => 
        o._id.includes(searchTerm) || 
        o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Order Management</h1>
                <p className="text-gray-400">Track and fulfill customer orders.</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-center">
                <div className="relative w-full max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by Order ID or Customer..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-gray-400 text-sm">
                            <tr>
                                <th className="p-4 font-medium">Order ID</th>
                                <th className="p-4 font-medium">Customer</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Total</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Update Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700 text-gray-300">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center">
                                        <div className="flex justify-center">
                                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-700/50 transition-colors">
                                    <td className="p-4 font-mono text-sm text-blue-400">#{order._id.substring(0, 10)}</td>
                                    <td className="p-4">
                                        <p className="font-medium text-white">{order.user?.name || 'Guest'}</p>
                                        <p className="text-xs text-gray-400">{order.user?.email}</p>
                                    </td>
                                    <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 font-medium text-white">LKR {order.totalPrice.toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                                            order.status === 'Delivered' ? 'bg-[#008000]/20 text-[#008000]' : 
                                            order.status === 'Processing' ? 'bg-blue-500/20 text-blue-400' : 
                                            order.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                                            'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                            {order.status === 'Delivered' && <FiCheck />}
                                            {order.status === 'Processing' && <FiPackage />}
                                            {order.status === 'Shipped' && <FiTruck />}
                                            {order.status === 'Cancelled' && <FiX />}
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <select 
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                            className="bg-gray-900 border border-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminOrders;
