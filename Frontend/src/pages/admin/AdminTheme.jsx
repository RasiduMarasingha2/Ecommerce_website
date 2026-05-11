import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTheme, updateTheme, setThemeLocally } from '../../redux/slices/themeSlice';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const AdminTheme = () => {
    const dispatch = useDispatch();
    const { currentTheme, loading } = useSelector((state) => state.theme);
    
    const [formData, setFormData] = useState({
        primaryColor: '#3B82F6',
        secondaryColor: '#10B981',
        backgroundColor: '#111827',
        textColor: '#FFFFFF',
    });

    useEffect(() => {
        dispatch(fetchTheme());
    }, [dispatch]);

    useEffect(() => {
        if (currentTheme) {
            setFormData({
                primaryColor: currentTheme.primaryColor || '#3B82F6',
                secondaryColor: currentTheme.secondaryColor || '#10B981',
                backgroundColor: currentTheme.backgroundColor || '#111827',
                textColor: currentTheme.textColor || '#FFFFFF',
            });
        }
    }, [currentTheme]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Preview instantly
        dispatch(setThemeLocally({ [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateTheme(formData)).unwrap();
            toast.success('Theme updated successfully');
        } catch (error) {
            toast.error('Failed to update theme');
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Theme Customization</h1>
                <p className="text-gray-400">Change the look and feel of the website in real-time.</p>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden"
            >
                <div className="p-6 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">Color Palette</h3>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Primary Color */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Primary Color</label>
                            <div className="flex gap-3">
                                <input 
                                    type="color" 
                                    name="primaryColor"
                                    value={formData.primaryColor}
                                    onChange={handleChange}
                                    className="w-12 h-12 rounded border border-gray-600 cursor-pointer"
                                />
                                <input 
                                    type="text" 
                                    name="primaryColor"
                                    value={formData.primaryColor}
                                    onChange={handleChange}
                                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 text-white"
                                />
                            </div>
                        </div>

                        {/* Secondary Color */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Color</label>
                            <div className="flex gap-3">
                                <input 
                                    type="color" 
                                    name="secondaryColor"
                                    value={formData.secondaryColor}
                                    onChange={handleChange}
                                    className="w-12 h-12 rounded border border-gray-600 cursor-pointer"
                                />
                                <input 
                                    type="text" 
                                    name="secondaryColor"
                                    value={formData.secondaryColor}
                                    onChange={handleChange}
                                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 text-white"
                                />
                            </div>
                        </div>

                        {/* Background Color */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Background Color (Light/Dark)</label>
                            <div className="flex gap-3">
                                <input 
                                    type="color" 
                                    name="backgroundColor"
                                    value={formData.backgroundColor}
                                    onChange={handleChange}
                                    className="w-12 h-12 rounded border border-gray-600 cursor-pointer"
                                />
                                <input 
                                    type="text" 
                                    name="backgroundColor"
                                    value={formData.backgroundColor}
                                    onChange={handleChange}
                                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 text-white"
                                />
                            </div>
                        </div>

                        {/* Text Color */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Main Text Color</label>
                            <div className="flex gap-3">
                                <input 
                                    type="color" 
                                    name="textColor"
                                    value={formData.textColor}
                                    onChange={handleChange}
                                    className="w-12 h-12 rounded border border-gray-600 cursor-pointer"
                                />
                                <input 
                                    type="text" 
                                    name="textColor"
                                    value={formData.textColor}
                                    onChange={handleChange}
                                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 text-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-700 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-blue-500/30 transition-colors"
                        >
                            {loading ? 'Saving...' : 'Save Theme'}
                        </button>
                    </div>
                </form>
            </motion.div>

            {/* Live Preview Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-gray-700 overflow-hidden shadow-2xl"
                style={{ backgroundColor: formData.backgroundColor }}
            >
                <div className="p-6 border-b border-gray-700/50 bg-black/20">
                    <h3 className="text-xl font-bold" style={{ color: formData.textColor }}>Live Preview</h3>
                </div>
                <div className="p-8 space-y-6">
                    <h2 className="text-3xl font-bold" style={{ color: formData.textColor }}>Welcome to Our Store</h2>
                    <p style={{ color: formData.textColor, opacity: 0.8 }}>This is a preview of how your typography and colors will look on the frontend.</p>
                    
                    <div className="flex gap-4">
                        <button 
                            className="px-6 py-3 rounded-lg font-medium text-white transition-opacity hover:opacity-90"
                            style={{ backgroundColor: formData.primaryColor }}
                        >
                            Primary Action
                        </button>
                        <button 
                            className="px-6 py-3 rounded-lg font-medium text-white transition-opacity hover:opacity-90"
                            style={{ backgroundColor: formData.secondaryColor }}
                        >
                            Secondary Action
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminTheme;
