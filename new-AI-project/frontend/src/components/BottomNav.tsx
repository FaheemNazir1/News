import React from 'react';
import { LayoutDashboard, User, Newspaper } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'live', label: 'NEWS', icon: Newspaper },
    { id: 'dashboard', label: 'ANALYSIS', icon: LayoutDashboard },
    { id: 'profile', label: 'PROFILE', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 rounded-t-xl pb-safe">
      <div className="flex justify-around items-center h-20 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-forensic-blue' : 'text-gray-400 hover:text-gray-600'
              } transition-colors`}
            >
              <div className={`p-1.5 rounded-lg ${isActive ? 'bg-indigo-50' : ''}`}>
                 <Icon className={`w-6 h-6 ${isActive ? 'text-forensic-blue fill-forensic-blue/10' : ''}`} />
              </div>
              <span className={`text-[10px] font-semibold tracking-wider ${isActive ? 'text-forensic-dark' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
