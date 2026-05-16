import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { toast } from 'sonner';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await axiosClient.get('/seller/orders');
            setOrders(data);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await axiosClient.put(`/admin/orders/${id}/status`, { status }); // Using admin route for now if seller lacks specific order status endpoint, or modify backend to allow seller update
            toast.success('Order status updated');
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-gray-800">Customer Orders</h2>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-bold text-gray-600">Order ID</th>
                            <th className="p-4 font-bold text-gray-600">Customer</th>
                            <th className="p-4 font-bold text-gray-600">Date</th>
                            <th className="p-4 font-bold text-gray-600">Total</th>
                            <th className="p-4 font-bold text-gray-600">Status</th>
                            <th className="p-4 font-bold text-gray-600">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                <td className="p-4 font-mono text-sm">{order._id.substring(0, 8)}...</td>
                                <td className="p-4">
                                    <p className="font-bold">{order.user?.name}</p>
                                    <p className="text-xs text-gray-500">{order.user?.email}</p>
                                </td>
                                <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 font-bold text-blue-600">LKR {order.totalPrice.toFixed(2)}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        order.status === 'Processing' ? 'bg-[#008000]/10 text-[#005a00]' :
                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-600' :
                                        'bg-[#008000]/10 text-[#005a00]'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <select 
                                        value={order.status}
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                        className="bg-gray-50 border border-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                                    >
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && orders.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No orders found.</div>
                )}
            </div>
        </div>
    );
};

export default SellerOrders;
