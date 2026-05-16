import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../../redux/slices/productSlice';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiImage } from 'react-icons/fi';
import axiosClient from '../../api/axiosClient';
import { toast } from 'sonner';

const AdminProducts = () => {
    const dispatch = useDispatch();
    const { allProducts } = useSelector((state) => state.product);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const { data } = await axiosClient.get('/admin/products');
            dispatch(setProducts(data));
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        loadProducts();
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axiosClient.delete(`/admin/products/${id}`);
                toast.success('Product deleted successfully');
                loadProducts();
            } catch (error) {
                toast.error('Failed to delete product');
            }
        }
    };

    const filteredProducts = allProducts.filter(p => {
        const search = searchTerm.replace('#', '').toLowerCase();
        const shortId = (p.productId || p._id.slice(-5)).toLowerCase();
        return (p.name || p.title)?.toLowerCase().includes(search) || 
               p.category?.name?.toLowerCase().includes(search) ||
               shortId.includes(search);
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Products Management</h1>
                    <p className="text-gray-400">Manage your inventory, prices, and stock.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-500/30"
                >
                    <FiPlus /> Add Product
                </button>
            </div>

            {/* Controls */}
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-center">
                <div className="relative w-full max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Products Table */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-gray-400 text-sm">
                            <tr>
                                <th className="p-4 font-medium">Product</th>
                                <th className="p-4 font-medium">Product ID</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium">Price</th>
                                <th className="p-4 font-medium">Stock</th>
                                <th className="p-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700 text-gray-300">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center">
                                        <div className="flex justify-center">
                                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-700/50 transition-colors">
                                    <td className="p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                                            {product.images && product.images[0] ? (
                                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <FiImage className="text-gray-500 w-5 h-5" />
                                            )}
                                        </div>
                                        <span className="font-medium truncate max-w-[200px]" title={product.name || product.title}>
                                            {product.name || product.title}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <code className="text-xs bg-gray-900 text-blue-400 px-2 py-1 rounded border border-gray-700 font-mono font-bold tracking-wider">
                                                #{product.productId || product._id.slice(-5).toUpperCase()}
                                            </code>
                                            <button 
                                                onClick={() => { navigator.clipboard.writeText(product.productId || product._id.slice(-5).toUpperCase()); toast.success('ID copied!') }} 
                                                className="text-gray-500 hover:text-blue-400 transition-colors"
                                                title="Copy ID"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4">{product.category?.name || 'Uncategorized'}</td>
                                    <td className="p-4 font-medium text-white">LKR {product.price.toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            product.stock > 10 ? 'bg-[#008000]/20 text-[#008000]' : 
                                            product.stock > 0 ? 'bg-yellow-500/20 text-yellow-400' : 
                                            'bg-red-500/20 text-red-400'
                                        }`}>
                                            {product.stock} in stock
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                                                <FiEdit2 />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(product._id)}
                                                className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
            
            {/* Modal placeholder (can be extracted to separate component) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl border border-gray-700 shadow-2xl"
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">Add New Product</h2>
                        <p className="text-gray-400 mb-6">Form implementation will go here...</p>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg shadow-blue-500/30">
                                Save Product
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
