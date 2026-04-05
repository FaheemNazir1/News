import React from 'react';
import { ShieldCheck, Activity, Fingerprint } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-forensic-dark flex font-sans">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex w-[45%] flex-col text-white relative overflow-hidden bg-forensic-darker border-r border-forensic-blue">
        {/* Abstract Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}>
        </div>

        <div className="relative p-12 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-16">
              <div className="w-10 h-10 bg-forensic-blue rounded-lg flex flex-col items-center justify-center text-white font-bold opacity-90 shadow-[0_0_15px_rgba(20,40,93,0.5)]">
                <span className="text-xl">V</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">VeriNews</span>
            </div>

            <h1 className="text-5xl font-extrabold leading-tight tracking-tight mb-6">
              Identify Truth <br/> from <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-forensic-accent italic">Fiction</span>
            </h1>
            <p className="text-forensic-neutral text-lg max-w-md">
              High-precision clinical analysis to protect the integrity of your signal environment.
            </p>
          </div>

          <div className="space-y-8 mt-12">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <Activity className="w-6 h-6 text-forensic-accent" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Real-time Analysis</h3>
                <p className="text-forensic-neutral text-sm mt-1">Extract information directly into our neural engine for instantaneous distribution network and metadata validation.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <Fingerprint className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Deep-fake Detection</h3>
                <p className="text-forensic-neutral text-sm mt-1">Military-standard pulse detection and variance controls to expose sophisticated synthetic media manipulation.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Verification Chains</h3>
                <p className="text-forensic-neutral text-sm mt-1">Cryptographically secure ledgers built to meet federal compliance guidelines.</p>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-forensic-neutral mt-8">
            © {new Date().getFullYear()} VeriNews
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-forensic-light relative relative overflow-y-auto">
        <div className="max-w-md w-full">
          <div className="text-center mb-10 lg:hidden">
              <div className="inline-flex w-12 h-12 bg-forensic-blue rounded-lg items-center justify-center text-white font-bold opacity-90 shadow-lg mb-4">
                <span className="text-2xl">V</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-forensic-dark">VeriNews</h1>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h2>
            <p className="text-gray-500 mt-2">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
