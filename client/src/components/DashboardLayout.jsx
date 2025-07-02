import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const DashboardLayout = () => {
    return (
        <div className="flex">
            <NavBar />
            <main className="flex-1 p-8 bg-gray-50 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout; 