import React from 'react';
import { Activity, ShieldCheck, Fingerprint, FileText, ArrowRight, UserCircle, LogIn } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="bg-[#F8F9FB] min-h-screen font-sans pb-24 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5 }}></div>
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-forensic-accent/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-indigo-400/15 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-4 bg-transparent">
        <div className="flex items-center space-x-2">
           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-forensic-blue" />
           </div>
           <span className="font-bold text-gray-800 tracking-tight">VeriNews</span>
        </div>
        <button 
          onClick={onLoginClick}
          className="flex items-center space-x-2 text-gray-600 hover:text-forensic-blue font-medium transition-colors"
        >
           <UserCircle className="w-5 h-5" />
           <span className="text-sm">Login</span>
        </button>
      </nav>

      {/* Hero Section */}
      <main className="px-6 mt-12 space-y-10">
        <div className="w-full flex flex-col items-center text-center animate-fadeUp">
           <div className="inline-block px-4 py-1.5 mb-6 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-widest cursor-default hover:bg-blue-100 transition-colors">
              VeriNews
           </div>
           <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
             Identify Truth<br/>from <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-forensic-accent italic inline animate-pulse">Fiction</span> <br/><span className="text-4xl md:text-5xl font-light text-gray-500">with AI</span>
           </h1>
           <p className="mt-6 text-gray-600 text-base md:text-lg leading-relaxed max-w-lg mx-auto opacity-0 animate-fadeUp" style={{ animationDelay: '200ms' }}>
             In an era of information volatility, we provide an authoritative source of truth. High-precision clinical analysis to protect the integrity of your signal environment.
           </p>

           <div className="flex flex-col space-y-4 mt-8 w-full max-w-xs mx-auto opacity-0 animate-fadeUp" style={{ animationDelay: '400ms' }}>
              <button onClick={onLoginClick} className="bg-forensic-dark text-white py-4 px-6 rounded-xl flex justify-between items-center font-bold text-sm hover:bg-forensic-blue transition-colors shadow-xl">
                 Get Started
                 <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="bg-gray-200/50 text-gray-700 py-4 px-6 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                 View Methodology
              </button>
           </div>
        </div>

        {/* Hero Graphic */}
        <div className="glass-card-dark aspect-square w-full max-w-md mx-auto relative flex items-center justify-center p-8 bg-gradient-to-br from-[#0c1631] to-[#040814] opacity-0 animate-fadeUp" style={{ animationDelay: '600ms' }}>
           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
           <div className="relative z-10 w-48 h-48 border border-white/20 rounded flex items-center justify-center bg-white/5 backdrop-blur-sm animate-float">
              <span className="text-[120px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-white/90 to-white/40 animate-glow">
                 A
              </span>
           </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16">
           <h2 className="text-2xl font-bold text-gray-900 mb-2">Clinical Precision Features</h2>
           <p className="text-sm text-gray-500 mb-6">Our system utilizes specialized sub-models designed for high-stakes information forensic analysis.</p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                 <div className="w-10 h-10 bg-forensic-dark rounded-xl flex items-center justify-center text-white mb-4 shadow-md">
                    <Activity className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Real-time Analysis</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Extract information directly into our neural engine for instantaneous distribution network and metadata validation.</p>
                 </div>
              </div>

              {/* Feature 2 (Dark) */}
              <div className="bg-forensic-dark rounded-2xl p-6 shadow-lg text-white flex flex-col justify-between">
                 <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white mb-4 backdrop-blur-md">
                    <Fingerprint className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="font-bold text-lg mb-2">Deep-fake Detection</h3>
                    <p className="text-sm text-forensic-neutral leading-relaxed mb-4">Military-standard pulse detection and variance controls to expose sophisticated synthetic media manipulation.</p>
                    <a href="#" className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
                       Learn More <ArrowRight className="w-3 h-3 ml-1" />
                    </a>
                 </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-100 rounded-2xl p-6 flex flex-col justify-between border border-gray-200">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-200 mb-4 shadow-sm">
                    <FileText className="w-5 h-5 text-forensic-blue" />
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">News Verification</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Cross-check stories for objective truth and detect misleading narratives.</p>
                 </div>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center py-10">
                 <h3 className="font-bold text-gray-900 text-xl w-full text-left mb-2">Verification Chains</h3>
                 <p className="text-sm text-gray-500 leading-relaxed w-full text-left mb-6">Cryptographically secure ledgers of verified content for institutional compliance and research accuracy.</p>
                 <div className="flex space-x-2 w-full">
                    <div className="px-3 py-1 bg-gray-100 text-[10px] font-bold text-gray-500 rounded uppercase tracking-wider border border-gray-200">Independent</div>
                    <div className="px-3 py-1 bg-gray-100 text-[10px] font-bold text-gray-500 rounded uppercase tracking-wider border border-gray-200">Public API</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Intelligence Report Demo */}
        <div className="mt-16 bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
           <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center">
                 <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                 <h4 className="font-bold text-gray-900 leading-tight">Intelligence Report</h4>
                 <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">ID: 44-8F-99-TR</p>
              </div>
           </div>

           <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                 <span className="text-sm font-semibold text-gray-700">Source Authenticity</span>
                 <span className="text-sm font-bold text-green-600">VERIFIED</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                 <span className="text-sm font-semibold text-gray-700">Semantic Consistency</span>
                 <span className="text-sm font-bold text-green-600 text-right leading-tight">94%<br/><span className="text-[10px] uppercase tracking-wider">Corroborated</span></span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                 <span className="text-sm font-semibold text-red-800">Network Anomaly</span>
                 <span className="text-sm font-bold text-red-600">DETECTED</span>
              </div>
           </div>
        </div>

        {/* Trust Section */}
        <div className="mt-16 mb-24">
           <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">Trust is Built on Evidence</h2>
           <p className="text-sm text-gray-600 leading-relaxed mb-8">
              We don't just provide a score, we provide the chain-of-custody for information. Every detection is accompanied by a surgical breakdown of semantic discrepancies, pixel-level artifacts, and source reputation history.
           </p>

           <div className="space-y-6">
              <div className="flex items-start space-x-4">
                 <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-green-600" />
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-900">Source platform validation</h4>
                    <p className="text-sm text-gray-500 mt-1">Verify information against reliable syndication partners databases.</p>
                 </div>
              </div>
              <div className="flex items-start space-x-4">
                 <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-green-600" />
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-900">Biometric fingerprinting</h4>
                    <p className="text-sm text-gray-500 mt-1">Match linguistic patterns to known threat actors and bot syndicates looking for spread payloads.</p>
                 </div>
              </div>
           </div>
        </div>
      </main>

      {/* Footer Banner */}
      <div className="bg-forensic-dark text-white p-10 text-center mt-auto">
         <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Defend the Truth?</h2>
         <p className="text-forensic-neutral text-sm mb-8 max-w-sm mx-auto leading-relaxed">
            Join users using VeriNews to verify information and stay informed.
         </p>
         <div className="flex flex-col space-y-3 max-w-xs mx-auto">
            <button onClick={onLoginClick} className="bg-white text-forensic-dark py-3.5 px-6 rounded-xl font-bold hover:bg-gray-100 transition-colors text-sm">
               Get Started Free
            </button>
            <button className="bg-transparent border border-forensic-blue text-white py-3.5 px-6 rounded-xl font-bold hover:bg-white/5 transition-colors text-sm">
               Book Enterprise Demo
            </button>
         </div>
      </div>
    </div>
  );
};

export default LandingPage;
