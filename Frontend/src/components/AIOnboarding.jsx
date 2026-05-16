import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axiosClient from '../api/axiosClient';

const AIOnboarding = ({ isOpen, onClose, onComplete }) => {
    const [step, setStep] = useState(0);
    const [preferences, setPreferences] = useState({
        category: '',
        budget: '',
        purpose: '',
        brand: ''
    });
    const [loading, setLoading] = useState(false);

    const questions = [
        {
            key: 'category',
            title: "What are you primarily shopping for today?",
            options: [
                { value: 'gaming', label: 'Gaming Gear', icon: '🎮' },
                { value: 'electronics', label: 'Electronics & Tech', icon: '💻' },
                { value: 'fashion', label: 'Fashion & Apparel', icon: '👕' },
                { value: 'accessories', label: 'Accessories', icon: '⌚' }
            ]
        },
        {
            key: 'budget',
            title: "What's your typical budget range?",
            options: [
                { value: 'low', label: 'Budget Friendly (< LKR 50)', icon: '💵' },
                { value: 'medium', label: 'Mid-Range (LKR 50 - LKR 200)', icon: '💰' },
                { value: 'high', label: 'Premium (> LKR 200)', icon: '💎' }
            ]
        },
        {
            key: 'purpose',
            title: "What is your primary use case?",
            options: [
                { value: 'gaming', label: 'Gaming & Performance', icon: '🎯' },
                { value: 'work', label: 'Work & Productivity', icon: '💼' },
                { value: 'casual', label: 'Casual & Daily Use', icon: '☕' }
            ]
        },
        {
            key: 'brand',
            title: "Do you have a brand preference?",
            options: [
                { value: 'premium', label: 'Top Tier / Premium Brands', icon: '⭐' },
                { value: 'budget', label: 'Value / Emerging Brands', icon: '📈' },
                { value: 'any', label: 'No Preference', icon: '🤷' }
            ]
        }
    ];

    const handleSelect = (key, value) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
        if (step < questions.length - 1) {
            setTimeout(() => setStep(step + 1), 300);
        }
    };

    const handleSubmit = async () => {

        const isComplete = Object.values(preferences).every(v => v !== '');
        if (!isComplete) {
            toast.error("Please answer all questions or click Skip.");
            return;
        }

        setLoading(true);
        try {
            await axiosClient.post('/recommendation/onboarding', preferences);
            toast.success("Preferences saved successfully!");
            if (onComplete) onComplete();
            if (onClose) onClose();
        } catch (error) {
            toast.error("Failed to save preferences.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        localStorage.setItem('hasSkippedOnboarding', 'true');
        if (onClose) onClose();
    };

    if (!isOpen) return null;

    const currentQ = questions[step];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md px-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl"
                >
                    <div className="bg-gradient-to-r from-black to-gray-800 p-6 text-white text-center relative">
                        <h2 className="text-2xl font-black">AI Product Matcher</h2>
                        <p className="text-gray-300 text-sm mt-1">Let SWI-Prolog find your perfect match</p>
                        <button onClick={handleSkip} className="absolute top-6 right-6 text-gray-400 hover:text-white text-sm font-bold transition-colors">
                            Skip
                        </button>
                    </div>

                    <div className="p-8">
                        <div className="flex justify-between mb-6">
                            {questions.map((_, idx) => (
                                <div key={idx} className={`h-1 flex-1 mx-1 rounded-full ${idx <= step ? 'bg-[#008000]' : 'bg-gray-200'} transition-colors duration-300`} />
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">{currentQ.title}</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {currentQ.options.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleSelect(currentQ.key, opt.value)}
                                            className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${preferences[currentQ.key] === opt.value
                                                    ? 'border-[#008000] bg-green-50 shadow-sm'
                                                    : 'border-gray-100 bg-white hover:border-gray-300'
                                                }`}
                                        >
                                            <span className="text-2xl">{opt.icon}</span>
                                            <span className="font-bold text-gray-700">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-8 flex justify-between">
                            <button
                                onClick={() => setStep(Math.max(0, step - 1))}
                                disabled={step === 0}
                                className="px-6 py-2 rounded-lg font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                            >
                                Back
                            </button>

                            {step === questions.length - 1 ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || !preferences[currentQ.key]}
                                    className="px-8 py-2 rounded-lg font-bold bg-[#008000] text-white hover:bg-green-700 hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
                                >
                                    {loading ? 'Analyzing...' : 'Find My Matches'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => setStep(Math.min(questions.length - 1, step + 1))}
                                    disabled={!preferences[currentQ.key]}
                                    className="px-8 py-2 rounded-lg font-bold bg-black text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AIOnboarding;
