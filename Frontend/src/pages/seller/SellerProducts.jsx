import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { toast } from 'sonner';
import { FiPlus, FiTrash2, FiEdit2, FiImage } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SellerProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [images, setImages] = useState([]);
    const [inFlashSale, setInFlashSale] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await axiosClient.get('/seller/products');
            setProducts(data);
        } catch (error) {
            toast.error('Failed to load your products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleFileChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Uploading product... Please wait.');
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('category', category);
        formData.append('inFlashSale', inFlashSale);
        
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        try {
            await axiosClient.post('/seller/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Product added successfully!', { id: toastId });
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add product', { id: toastId });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this product?')) {
            try {
                await axiosClient.delete(`/seller/products/${id}`);
                toast.success('Product deleted');
                fetchProducts();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-gray-800">My Products</h2>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                >
                    <FiPlus className="mr-2" /> Add New Product
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-bold text-gray-600">Product</th>
                            <th className="p-4 font-bold text-gray-600">Product ID</th>
                            <th className="p-4 font-bold text-gray-600">Price</th>
                            <th className="p-4 font-bold text-gray-600">Stock</th>
                            <th className="p-4 font-bold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                        {product.images && product.images[0] ? (
                                            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                                        ) : <FiImage className="text-gray-400" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">{product.title}</p>
                                        <p className="text-xs text-gray-500">{product.category?.name || product.category}</p>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <code className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded border border-gray-200 font-mono font-bold tracking-wider">
                                            #{product.productId || product._id.slice(-5).toUpperCase()}
                                        </code>
                                        <button 
                                            onClick={() => { navigator.clipboard.writeText(product.productId || product._id.slice(-5).toUpperCase()); toast.success('ID copied to clipboard!') }} 
                                            className="text-gray-400 hover:text-blue-500 transition-colors"
                                            title="Copy ID"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                        </button>
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-gray-800">${product.price}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && products.length === 0 && (
                    <div className="p-8 text-center text-gray-500">You haven't added any products yet.</div>
                )}
            </div>

            {/* Add Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black text-gray-800">Add New Product</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#008000]/50" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#008000]/50" rows="3"></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
                                    <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#008000]/50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Stock</label>
                                    <input type="number" required value={stock} onChange={e => setStock(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#008000]/50" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Category (Name or ID)</label>
                                <input type="text" required value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#008000]/50" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Product Images (Multiple allowed)</label>
                                <input type="file" required multiple onChange={handleFileChange} accept="image/*" className="w-full px-4 py-2 border border-gray-300 rounded-xl text-black bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#008000]/10 file:text-[#008000] hover:file:bg-[#008000]/20" />
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl mt-4">
                                <input 
                                    type="checkbox" 
                                    id="inFlashSale" 
                                    checked={inFlashSale} 
                                    onChange={e => setInFlashSale(e.target.checked)} 
                                    className="w-5 h-5 accent-[#008000] cursor-pointer rounded" 
                                />
                                <div>
                                    <label htmlFor="inFlashSale" className="block text-sm font-bold text-gray-800 cursor-pointer">Include in Active Flash Sale</label>
                                    <p className="text-xs text-gray-500">If checked, this product will be featured in the homepage flash sale (if one is active).</p>
                                </div>
                            </div>
                            <button type="submit" className="w-full py-3 bg-[#008000] text-white font-bold rounded-xl hover:bg-green-700 transition-colors mt-6 shadow-[0_0_15px_rgba(0,128,0,0.3)] hover:shadow-[0_0_20px_rgba(0,128,0,0.5)]">
                                Upload Product
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default SellerProducts;
