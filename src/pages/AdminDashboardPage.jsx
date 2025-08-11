// src/pages/AdminDashboardPage.jsx

import React, { useState } from 'react';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import app from '../firebase';
import { FiPlus, FiLogOut } from 'react-icons/fi';

// Namma puthu components-a import panrom
import DashboardTabs from '../components/admin/DashboardTabs';
import Overview from '../components/admin/Overview';
import ProjectsTab from '../components/admin/ProjectsTab';
// Namma apram matha tabs-ayum (MessagesTab, etc.) import pannuvom...

const AdminDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('Overview');
    const auth = getAuth(app);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/admin-login');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };
    
  return (
    <div className="min-h-screen bg-[#0c1220] text-white p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 mt-18">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-400">Manage your portfolio content and settings</p>
            </div>
            <div className="flex gap-4 mt-4 sm:mt-0">
                <button 
                  onClick={() => setActiveTab('Projects')} // Add project click panna, Projects tab-ku pogum
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                    <FiPlus /> Add New Project
                </button>
                <button 
                    onClick={handleLogout}
                    className="bg-red-600/20 text-red-400 font-semibold py-2 px-4 rounded-md hover:bg-red-600/30 transition-colors"
                    aria-label="Log Out"
                >
                    <FiLogOut />
                </button>
            </div>
        </header>

        <main>
            {/* Tabs */}
            <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {/* Conditional Content */}
            <div>
                {activeTab === 'Overview' && <Overview />}
                {activeTab === 'Projects' && <ProjectsTab />}
                {/* Namma ippothaiku matha tabs-a handle pannala */}
                {/* {activeTab === 'Messages' && <MessagesTab />} */}
            </div>
        </main>

      </div>
    </div>
  );
};

export default AdminDashboardPage;