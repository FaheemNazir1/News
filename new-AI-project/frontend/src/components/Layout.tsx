import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: 'main' | 'fake-news';
  onViewChange: (view: 'main' | 'fake-news') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            📰 News AI
          </h1>
          
          <nav className="space-y-2">
            <button
              onClick={() => onViewChange('main')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                currentView === 'main'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📊 Dashboard
            </button>
            
            <button
              onClick={() => onViewChange('fake-news')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                currentView === 'fake-news'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🚨 Fake News
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;
