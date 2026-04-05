import React, { useState } from 'react';
import { Link2, Clock, BrainCircuit, ScanSearch, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  onAnalyze?: (url: string) => void;
  isLoading?: boolean;
}

const NeuralSummary: React.FC<Props> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    if (url) {
      if(onAnalyze) onAnalyze(url);
      setAnalyzed(true);
    }
  };

  return (
    <div className="bg-[#F4F5F7] min-h-screen font-sans pb-28 pt-8 px-4">
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-forensic-dark tracking-tight leading-tight mb-2">
        Neural Summary
      </h1>
      <p className="text-sm text-gray-600 mb-6">Input a source URL to extract the clinical truth.</p>

      {/* Input Box */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex items-center mb-6">
         <div className="px-3 text-gray-400">
            <Link2 className="w-5 h-5" />
         </div>
         <input 
            type="text" 
            placeholder="Paste article URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-1 py-3 bg-transparent outline-none text-sm font-medium"
         />
         <button onClick={handleAnalyze} disabled={isLoading} className="bg-forensic-dark text-white rounded-xl px-4 py-2.5 flex items-center space-x-2 text-sm font-bold hover:bg-forensic-darker transition-colors disabled:opacity-50">
            <span>{isLoading ? 'Scanning...' : 'Analyze'}</span>
            <ScanSearch className="w-4 h-4" />
         </button>
      </div>

      {analyzed && (
         <div className="space-y-4">
            {/* Core Synthesis Module */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                     <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                        <FileTextIcon className="w-5 h-5 text-forensic-blue" />
                     </div>
                     <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">Core<br/>Synthesis</h3>
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest absolute top-10 right-6">
                           Source: World News<br/>Daily
                        </div>
                     </div>
                  </div>

                  <ul className="space-y-5 text-sm text-gray-700 font-medium">
                     <li className="flex items-start">
                        <span className="mr-3 text-xl font-bold text-gray-300 leading-none mt-0.5">•</span>
                        <span>Global semiconductor demand is projected to surge by <span className="font-bold text-gray-900">24% in Q4</span>, driven primarily by the rapid expansion of decentralized AI infrastructure across Southeast Asia.</span>
                     </li>
                     <li className="flex items-start">
                        <span className="mr-3 text-xl font-bold text-gray-300 leading-none mt-0.5">•</span>
                        <span>Major manufacturing hubs are reporting a pivot toward 2nm architecture, signaling a significant shift in production capability ahead of the 2025 roadmap.</span>
                     </li>
                     <li className="flex items-start">
                        <span className="mr-3 text-xl font-bold text-gray-300 leading-none mt-0.5">•</span>
                        <span>Analysts suggest that logistical bottlenecks in the Suez Canal may delay initial shipments, despite the increased manufacturing capacity.</span>
                     </li>
                  </ul>
               </div>

               <div className="border-t border-gray-100 p-6 bg-gray-50/50">
                  <div className="flex justify-between items-center mb-3">
                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sentiment Analysis</span>
                     <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Neutral-Cautious</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden flex">
                     <div className="bg-forensic-dark w-[65%] h-full rounded-full"></div>
                  </div>
               </div>
            </div>

            {/* Intelligence Metadata */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
               <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Intelligence Metadata</h4>
               
               <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-500 flex items-center space-x-2"><Clock className="w-4 h-4"/> <span>Read Time</span></span>
                     <span className="font-bold text-gray-900">12 mins</span>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-500 flex items-center space-x-2"><BrainCircuit className="w-4 h-4"/> <span>Complexity</span></span>
                     <span className="font-bold text-gray-900">Technical</span>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-500 flex items-center space-x-2"><ScanSearch className="w-4 h-4"/> <span>Entities Found</span></span>
                     <span className="font-bold text-gray-900">14 Identified</span>
                  </div>
               </div>
            </div>

            {/* Visual Context */}
            <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
               <div className="aspect-[16/9] bg-gradient-to-tr from-slate-900 to-slate-800 relative flex items-end p-4">
                  {/* Simulated Image Content */}
                  <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-forensic-dark via-transparent to-transparent opacity-90"></div>
                  
                  <p className="relative z-10 text-xs text-white/90 font-medium leading-relaxed">
                     <span className="font-bold text-white uppercase tracking-wider text-[10px] mr-2">Visual Context:</span> 
                     Production line of 2nm architecture processors in a clean room environment.
                  </p>
               </div>
            </div>

            {/* Veracity Check */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] overflow-hidden relative mt-2">
               <div className="bg-[#00FF9D]/20 px-4 py-2 flex items-center justify-center space-x-2 border-b border-[#00FF9D]/30 w-full mb-6">
                  <CheckCircle2 className="w-4 h-4 text-[#00A163]" />
                  <span className="text-sm font-bold text-[#00A163]">Analyzed by TruthEngine v4</span>
               </div>

               <div className="px-6 flex items-start space-x-6 mb-6">
                  <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                     <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                        <circle cx="50" cy="50" r="40" stroke="#00C975" strokeWidth="8" fill="none" strokeDasharray="221 251" strokeLinecap="round" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-1">
                        <span className="text-3xl font-extrabold text-forensic-dark leading-none">88</span>
                     </div>
                  </div>
                  <div className="pt-2">
                     <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Trust Score</div>
                     <h3 className="text-xl font-bold text-gray-900 leading-tight">Veracity Check</h3>
                     <span className="inline-block mt-2 bg-[#00FF9D]/20 text-[#00A163] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Verified Evidence</span>
                  </div>
               </div>

               <div className="px-6 pb-6 space-y-3">
                  <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-start space-x-3 shadow-sm">
                     <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                     <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">Data Corroborated</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">The 24% projection matches official 10-K filings from major foundries and Q3 industry consensus reports.</p>
                     </div>
                  </div>
                  
                  <div className="bg-[#FFF5F5] border border-red-100 rounded-xl p-4 flex items-start space-x-3">
                     <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                     <div>
                        <h4 className="font-bold text-red-800 text-sm mb-1">Anomalous Claim Flagged</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">The claim regarding Suez Canal bottlenecks lacks specific shipping manifest data. Historical patterns suggest seasonal variance rather than a systemic failure.</p>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      )}
    </div>
  );
};

// Simple icon for bullet points
const FileTextIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <line x1="10" y1="9" x2="8" y2="9"></line>
  </svg>
)

export default NeuralSummary;
