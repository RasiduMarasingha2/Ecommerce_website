import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUsers } from '../../redux/slices/adminSlice';
import { motion } from 'framer-motion';
import { FiSearch, FiTrash2, FiShield, FiUser } from 'react-icons/fi';
import axios from '../../api/axiosClient';
import { toast } from 'sonner';

const AdminUsers = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state) => state.admin);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchAdminUsers());
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await axios.delete(`/admin/users/${id}`);
                toast.success('User deleted successfully');
                dispatch(fetchAdminUsers());
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    const filteredUsers = users?.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
                <p className="text-gray-400">View and manage all registered users.</p>
            </div>

            {/* Controls */}
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-center">
                <div className="relative w-full max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search users by name or email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Users Table */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-gray-400 text-sm">
                            <tr>
                                <th className="p-4 font-medium">User Info</th>
                                <th className="p-4 font-medium">Role</th>
                                <th className="p-4 font-medium">Joined Date</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700 text-gray-300">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center">
                                        <div className="flex justify-center">
                                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-700/50 transition-colors">
                                    <td className="p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl overflow-hidden shrink-0">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <FiUser className="text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{user.name}</p>
                                            <p className="text-xs text-gray-400">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {user.role === 'admin' && <FiShield className="text-purple-400" />}
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                                user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 
                                                user.role === 'seller' ? 'bg-blue-500/20 text-blue-400' : 
                                                'bg-gray-500/20 text-gray-400'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => handleDelete(user._id)}
                                            disabled={user.role === 'admin'}
                                            className={`p-2 rounded-lg transition-colors ${
                                                user.role === 'admin' 
                                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                                                : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                            }`}
                                            title={user.role === 'admin' ? "Cannot delete admin users" : "Delete user"}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!loading && filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminUsers;
