import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { toast } from 'sonner';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosClient.post('/auth/forgot-password', { email });
            toast.success('OTP sent to your email!');
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosClient.post('/auth/verify-otp', { email, otp });
            toast.success('OTP Verified!');
            setStep(3);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosClient.post('/auth/reset-password', { email, otp, newPassword });
            toast.success('Password reset successfully! Please log in.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#002200] to-black relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-screen pointer-events-none"></div>

            <motion.button 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate('/login')}
                className="absolute top-8 left-8 z-50 flex items-center text-gray-400 hover:text-white transition-colors group"
            >
                <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                <span className="font-medium text-sm">Back to Login</span>
            </motion.button>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-md z-10 p-[3px] rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,128,0,0.1)]"
            >
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="absolute inset-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_280deg,#008000_360deg)] opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#008000]/20 via-transparent to-[#008000]/20 blur-xl"></div>
                <div className="absolute inset-0 rounded-[2rem] border border-gray-200"></div>

                <div className="relative w-full h-full p-10 bg-white/90 backdrop-blur-2xl rounded-[calc(2rem-3px)]">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-[#008000] to-green-400 p-[2px]">
                            <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-inner">
                                <svg className="w-6 h-6 text-[#008000]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-black tracking-tight">Reset Password</h2>
                        <p className="text-gray-500 mt-2 text-sm font-medium">
                            {step === 1 && "Enter your email to receive an OTP."}
                            {step === 2 && "Enter the 6-digit OTP sent to your email."}
                            {step === 3 && "Create your new secure password."}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.form key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleSendOTP} className="space-y-6">
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008000]/50 focus:border-[#008000] transition-all"
                                    placeholder="Enter your Email"
                                    required
                                />
                                <button disabled={loading} type="submit" className="w-full py-4 rounded-xl bg-black text-white font-bold hover:bg-[#008000] hover:shadow-[0_0_20px_rgba(0,128,0,0.4)] transition-all">
                                    {loading ? 'Sending...' : 'Send OTP'}
                                </button>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.form key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleVerifyOTP} className="space-y-6">
                                <input 
                                    type="text" 
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength="6"
                                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008000]/50 focus:border-[#008000] transition-all text-center tracking-[1em] font-bold text-xl"
                                    placeholder="------"
                                    required
                                />
                                <button disabled={loading} type="submit" className="w-full py-4 rounded-xl bg-black text-white font-bold hover:bg-[#008000] hover:shadow-[0_0_20px_rgba(0,128,0,0.4)] transition-all">
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </button>
                            </motion.form>
                        )}

                        {step === 3 && (
                            <motion.form key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleResetPassword} className="space-y-6">
                                <input 
                                    type="password" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008000]/50 focus:border-[#008000] transition-all"
                                    placeholder="New Password"
                                    required
                                />
                                <button disabled={loading} type="submit" className="w-full py-4 rounded-xl bg-black text-white font-bold hover:bg-[#008000] hover:shadow-[0_0_20px_rgba(0,128,0,0.4)] transition-all">
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
