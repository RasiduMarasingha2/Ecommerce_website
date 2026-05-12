import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Topbar from './Topbar';
import AIOnboarding from '../AIOnboarding';
import axiosClient from '../../api/axiosClient';

const UserLayout = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!userInfo) return;
      if (localStorage.getItem('hasSkippedOnboarding') === 'true') return;
      if (localStorage.getItem('hasCompletedOnboarding') === 'true') return;

      try {
         await axiosClient.get(`/recommendation/${userInfo._id}`);
         localStorage.setItem('hasCompletedOnboarding', 'true');
      } catch (err) {
         if (err.response && err.response.status === 400) {
            setShowOnboarding(true);
         }
      }
    };
    checkOnboarding();
  }, [userInfo]);

  const handleOnboardingComplete = () => {
      localStorage.setItem('hasCompletedOnboarding', 'true');
      setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <AIOnboarding 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
        onComplete={handleOnboardingComplete} 
      />
    </div>
  );
};

export default UserLayout;