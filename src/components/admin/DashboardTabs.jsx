// src/components/admin/DashboardTabs.jsx
import React from 'react';

const DashboardTabs = ({ activeTab, setActiveTab }) => {
    const tabs = ['Overview', 'Projects', 'Messages', 'Profile', 'Settings'];
    return (
        <div className="border-b border-gray-800 mb-8">
            <nav className="-mb-px flex space-x-6 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-3 px-1 border-b-2 text-sm font-medium whitespace-nowrap ${
                            activeTab === tab
                                ? 'border-purple-500 text-purple-400'
                                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default DashboardTabs;