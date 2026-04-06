import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import IntelligenceDashboard from './components/IntelligenceDashboard';
import LiveNewsPage from './components/LiveNewsPage';
import BottomNav from './components/BottomNav';
import { authService } from './services/authService';
import { articleService } from './services/api';
import './index.css';

function App() {
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [currentTab, setCurrentTab] = useState('live');
  const [loading, setLoading] = useState(false);
  const [lastAnalyzedUrl, setLastAnalyzedUrl] = useState<string>('');
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  useEffect(() => {
    if (currentTab === 'evidence') setCurrentTab('dashboard');
  }, [currentTab]);

  // Check authentication on mount
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const storedUser = authService.getStoredUser();
      setUser(storedUser);
    }
  }, []);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setShowAuth(false);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentTab('live');
  };

  const handleAnalyze = async (url: string) => {
    try {
      setLoading(true);
      setVerifyError(null);
      setLastAnalyzedUrl(url);
      const result = await articleService.analyzeUrl(url);
      setVerifyResult(result);
    } catch (err: any) {
      setVerifyResult(null);
      setVerifyError(err?.response?.data?.error || err?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    if (showAuth) {
      return (
         <div className="relative">
            <button 
               onClick={() => setShowAuth(false)} 
               className="absolute top-4 left-4 z-50 text-white font-medium bg-black/50 p-2 rounded-lg hover:bg-black/70 backdrop-blur"
            >
               ← Back to VeriNews
            </button>
            <AuthPage onAuthSuccess={handleAuthSuccess} />
         </div>
      );
    }
    return <LandingPage onLoginClick={() => setShowAuth(true)} />;
  }

  // Logged in experience
  return (
    <div className="bg-[#F4F5F7] min-h-screen pb-20">
      {/* Top Banner indicating logged in status */}
      <div className="bg-forensic-darker text-white text-xs font-bold uppercase tracking-widest py-1.5 px-4 flex justify-between items-center sticky top-0 z-50">
         <span className="text-forensic-accent">Logged in</span>
         <span className="opacity-70">{user.username}</span>
      </div>

      {currentTab === 'dashboard' && (
        <IntelligenceDashboard
          onAnalyze={handleAnalyze}
          isLoading={loading}
          lastAnalyzedUrl={lastAnalyzedUrl}
          verifyResult={verifyResult}
          verifyError={verifyError}
        />
      )}
      {currentTab === 'live' && <LiveNewsPage />}
      {currentTab === 'profile' && (
         <div className="p-6 sm:p-8 mt-6">
           <div className="flex items-start justify-between mb-6">
             <div>
               <h2 className="text-3xl font-extrabold text-forensic-dark tracking-tight leading-tight">Profile</h2>
               <p className="text-sm text-gray-500 mt-1">Manage your account and session</p>
             </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 lg:col-span-1">
               <div className="flex items-center space-x-4">
                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold text-2xl">
                   {user.username?.[0]?.toUpperCase()}
                 </div>
                 <div className="min-w-0">
                   <div className="font-bold text-gray-900 text-lg truncate">{user.username}</div>
                   <div className="text-sm text-gray-500 truncate">{user.email || 'Email not provided'}</div>
                 </div>
               </div>
               <div className="mt-6">
                 <button
                   onClick={handleLogout}
                   className="w-full bg-red-50 text-red-600 font-bold rounded-xl py-3 border border-red-100 hover:bg-red-100 transition-colors"
                 >
                   Log out
                 </button>
               </div>
             </div>

             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 lg:col-span-2">
               <div className="text-sm font-bold text-gray-900 mb-4">Account details</div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="border border-gray-200 rounded-xl p-4">
                   <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Username</div>
                   <div className="mt-1 text-sm font-semibold text-gray-900 break-words">{user.username}</div>
                 </div>
                 <div className="border border-gray-200 rounded-xl p-4">
                   <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Email</div>
                   <div className="mt-1 text-sm font-semibold text-gray-900 break-words">{user.email || '—'}</div>
                 </div>
               </div>

               <div className="mt-6 border-t border-gray-100 pt-6">
                 <div className="text-sm font-bold text-gray-900 mb-3">Session</div>
                 <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-gray-50 border border-gray-200 rounded-xl p-4">
                   <div className="text-sm text-gray-600">
                     You’re currently signed in on this device.
                   </div>
                   <button
                     onClick={handleLogout}
                     className="sm:w-auto w-full bg-forensic-dark text-white font-bold rounded-xl py-2.5 px-4 hover:bg-forensic-darker transition-colors"
                   >
                     Sign out
                   </button>
                 </div>
               </div>
             </div>
           </div>
         </div>
      )}

      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}

export default App;
