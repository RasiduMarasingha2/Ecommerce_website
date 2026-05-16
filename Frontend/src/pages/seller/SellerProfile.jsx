import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { toast } from 'sonner';

const SellerProfile = () => {
    const [profile, setProfile] = useState(null);
    const [storeName, setStoreName] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const { data } = await axiosClient.get('/seller/profile');
                setProfile(data);
                setStoreName(data.storeName);
            } catch (error) {
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axiosClient.put('/seller/profile', { storeName });
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl">
            <h2 className="text-2xl font-black text-gray-800 mb-6">Store Profile</h2>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Store Name</label>
                        <input 
                            type="text" 
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Verification Status</label>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            profile?.sellerVerification === 'approved' ? 'bg-[#008000]/10 text-green-700' : 
                            profile?.sellerVerification === 'pending' ? 'bg-[#008000]/10 text-orange-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {profile?.sellerVerification?.toUpperCase() || 'PENDING'}
                        </span>
                    </div>

                    <button 
                        type="submit" 
                        disabled={saving}
                        className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SellerProfile;
