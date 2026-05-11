import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axiosClient from '../../api/axiosClient';
import { toast } from 'sonner';

const AdminOffers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form
    const [title, setTitle] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isActive, setIsActive] = useState(true);

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const { data } = await axiosClient.get('/admin/offers');
            setOffers(data);
        } catch (error) {
            toast.error('Failed to fetch offers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/admin/offers', {
                title, discountPercentage, startTime, endTime, isActive
            });
            toast.success('Offer created successfully');
            setIsModalOpen(false);
            fetchOffers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create offer');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this offer?')) {
            try {
                await axiosClient.delete(`/admin/offers/${id}`);
                toast.success('Offer deleted');
                fetchOffers();
            } catch (error) {
                toast.error('Failed to delete offer');
            }
        }
    };

    const toggleStatus = async (offer) => {
        try {
            await axiosClient.put(`/admin/offers/${offer._id}`, { isActive: !offer.isActive });
            toast.success('Offer status updated');
            fetchOffers();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Offers & Flash Sales</h1>
                    <p className="text-gray-400">Manage time-limited promotions across the platform.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                >
                    + Create Offer
                </button>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full text-left text-gray-300">
                    <thead className="bg-gray-900 border-b border-gray-700">
                        <tr>
                            <th className="p-4 font-bold">Title</th>
                            <th className="p-4 font-bold">Discount</th>
                            <th className="p-4 font-bold">Timeframe</th>
                            <th className="p-4 font-bold">Status</th>
                            <th className="p-4 font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offers.map((offer) => (
                            <tr key={offer._id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="p-4 font-bold text-white">{offer.title}</td>
                                <td className="p-4 text-green-400 font-bold">{offer.discountPercentage}% OFF</td>
                                <td className="p-4">
                                    <p className="text-sm">Start: {new Date(offer.startTime).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-400">End: {new Date(offer.endTime).toLocaleDateString()}</p>
                                </td>
                                <td className="p-4">
                                    <button 
                                        onClick={() => toggleStatus(offer)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${offer.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                                    >
                                        {offer.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="p-4">
                                    <button onClick={() => handleDelete(offer._id)} className="text-red-400 hover:text-red-300">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && offers.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No active offers.</div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6"
                    >
                        <h3 className="text-xl font-bold text-white mb-6">Create New Flash Sale</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Title</label>
                                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Discount Percentage (%)</label>
                                <input type="number" required value={discountPercentage} onChange={e => setDiscountPercentage(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                                <input type="date" required value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">End Date</label>
                                <input type="date" required value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                                <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 bg-gray-900 border-gray-700" />
                                <label className="text-sm text-gray-300">Set as Active immediately</label>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg">Save Offer</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminOffers;
