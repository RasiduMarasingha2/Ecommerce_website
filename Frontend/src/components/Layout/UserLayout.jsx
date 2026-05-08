import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;