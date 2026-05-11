import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from '../../api/axiosClient';
import { toast } from 'sonner';

const AdminContent = () => {
    const [content, setContent] = useState({
        heroTitle: '',
        heroSubtitle: '',
        footerText: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const { data } = await axios.get('/admin/content');
                if (data && data._id) {
                    setContent({
                        heroTitle: data.heroTitle || '',
                        heroSubtitle: data.heroSubtitle || '',
                        footerText: data.footerText || ''
                    });
                }
            } catch (error) {
                console.error("Failed to load content", error);
            }
        };
        fetchContent();
    }, []);

    const handleChange = (e) => {
        setContent({ ...content, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put('/admin/content', content);
            toast.success('Homepage content updated successfully');
        } catch (error) {
            toast.error('Failed to update content');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Homepage Content CMS</h1>
                <p className="text-gray-400">Update the dynamic content of your storefront.</p>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden"
            >
                <div className="p-6 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">Hero Section</h3>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Hero Title</label>
                        <input 
                            type="text" 
                            name="heroTitle"
                            value={content.heroTitle}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white transition-all"
                            placeholder="Welcome to Our Premium Store"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Hero Subtitle</label>
                        <textarea 
                            name="heroSubtitle"
                            value={content.heroSubtitle}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white transition-all"
                            placeholder="Discover the best 3D products..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Footer Text</label>
                        <input 
                            type="text" 
                            name="footerText"
                            value={content.footerText}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white transition-all"
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-blue-500/30 transition-colors"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminContent;
