import React, { useMemo, useState } from 'react';
import { Search, Upload, ShieldAlert, Globe, ServerCrash, Scan, BarChart2, Hash, FileSpreadsheet, AlertTriangle, Link as LinkIcon, CheckCircle2 } from 'lucide-react';

interface Props {
  onAnalyze: (url: string) => void;
  isLoading?: boolean;
  lastAnalyzedUrl?: string;
  verifyResult?: any;
  verifyError?: string | null;
}

const IntelligenceDashboard: React.FC<Props> = ({ onAnalyze, isLoading, lastAnalyzedUrl, verifyResult, verifyError }) => {
  const [url, setUrl] = useState('');

  const [analyzed, setAnalyzed] = useState(false);

  const analyzedUrl = lastAnalyzedUrl || url;
  const hostname = useMemo(() => {
    try {
      const raw = (analyzedUrl || '').trim();
      if (!raw) return '';
      if (!/^https?:\/\//i.test(raw)) return '';
      return new URL(raw).hostname;
    } catch {
      return '';
    }
  }, [analyzedUrl]);

  const verifiedHostname = typeof verifyResult?.hostname === 'string' ? verifyResult.hostname : '';
  const effectiveHostname = verifiedHostname || hostname;

  const isBbc = useMemo(() => {
    if (typeof verifyResult?.isBbc === 'boolean') return verifyResult.isBbc;
    return hostname.toLowerCase().includes('bbc');
  }, [hostname, verifyResult]);

  const trustScore = typeof verifyResult?.trustScore === 'number' ? verifyResult.trustScore : (isBbc ? 86 : 35);
  const trustLabel = typeof verifyResult?.trustLabel === 'string' ? verifyResult.trustLabel : (isBbc ? 'High' : 'Extremely Low');
  const trustStroke = trustScore >= 80 ? '#16A34A' : trustScore >= 60 ? '#2563EB' : '#DC2626';
  const trustDash = trustScore >= 80 ? '216 251' : trustScore >= 60 ? '180 251' : '88 251';
  const factVerification = typeof verifyResult?.factVerification === 'number' ? `${verifyResult.factVerification}%` : (isBbc ? '82%' : '12%');
  const sourceAuthority = typeof verifyResult?.sourceAuthority === 'number' ? `${verifyResult.sourceAuthority}%` : (isBbc ? '90%' : '28%');
  const factColor = trustScore >= 80 ? 'text-green-600' : trustScore >= 60 ? 'text-blue-600' : 'text-red-600';
  const sourceColor = trustScore >= 80 ? 'text-green-600' : trustScore >= 60 ? 'text-blue-600' : 'text-red-600';
  const domainBadgeText = isBbc ? 'Reputable Domain' : 'Suspicious Domain';
  const domainBadgeClass = isBbc
    ? 'bg-green-100 text-green-800'
    : 'bg-blue-100 text-blue-800';
  const domainRepBorder = isBbc ? 'border-l-green-400' : 'border-l-red-500';
  const domainRepText = effectiveHostname
    ? (isBbc
        ? `The source "${effectiveHostname}" is widely regarded as a reputable news provider.`
        : `The source "${effectiveHostname}" may have limited transparency or inconsistent credibility signals.`)
    : 'The source domain could not be extracted from the provided link.';

  const handleAnalyze = () => {
    if (url) {
      onAnalyze(url);
      setAnalyzed(true);
    }
  };

  return (
    <div className="bg-[#F4F5F7] min-h-screen font-sans pb-28 pt-8 px-4">
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-forensic-dark tracking-tight leading-tight mb-6">
        Verification
      </h1>

      {/* Input Box */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex items-center mb-4">
         <input 
            type="text" 
            placeholder="Paste news URL or identifier..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-4 py-2 bg-transparent outline-none text-sm font-medium"
         />
         <button onClick={handleAnalyze} disabled={isLoading} className="bg-forensic-dark text-white rounded-xl px-4 py-2.5 flex items-center space-x-2 text-sm font-bold hover:bg-forensic-darker transition-colors disabled:opacity-50">
            <Scan className="w-4 h-4" />
            <span>{isLoading ? 'Scanning...' : 'Analyze'}</span>
         </button>
      </div>

      <button className="w-full flex items-center justify-center space-x-2 text-gray-600 font-semibold text-sm hover:text-gray-900 transition-colors py-2 mb-8">
         <Upload className="w-4 h-4" />
         <span>Upload PDF</span>
      </button>

      {/* Analysis Results */}
      {analyzed && (
         <div className="space-y-6">
            {verifyError ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-800">
                {verifyError}
              </div>
            ) : null}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Analyzed link</div>
              <div className="text-sm font-semibold text-gray-900 break-words">{analyzedUrl}</div>
              {verifyResult ? (
                <div className="text-xs text-gray-500 mt-1">Source: {effectiveHostname || 'Unknown'}</div>
              ) : (
                <div className="text-xs text-gray-500 mt-1">
                  Note: This screen currently shows demo-style results. To generate unique results per link, we need to connect it to a backend analysis endpoint.
                </div>
              )}
            </div>

            {verifyResult ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sentiment</div>
                  <div className="mt-1 text-lg font-extrabold text-gray-900 capitalize">{verifyResult.sentiment}</div>
                  <div className="text-xs text-gray-500 mt-1">Score: {typeof verifyResult.score === 'number' ? verifyResult.score : 0}</div>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Credibility</div>
                  <div className="mt-1 text-lg font-extrabold text-gray-900">{typeof verifyResult.credibilityScore === 'number' ? verifyResult.credibilityScore : 0}/100</div>
                  <div className="text-xs text-gray-500 mt-1">Fake score: {typeof verifyResult.fakeScore === 'number' ? verifyResult.fakeScore : 0}</div>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Flags</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">
                    {verifyResult.isFake ? 'Potentially fake' : 'Not flagged as fake'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Array.isArray(verifyResult.fakeReasons) && verifyResult.fakeReasons.length
                      ? verifyResult.fakeReasons.join(', ')
                      : '—'}
                  </div>
                </div>
              </div>
            ) : null}
            {/* Trust Integrity Score */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col items-center relative overflow-hidden">
               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest absolute top-6 flex items-center justify-center w-full">Trust Integrity Score</div>
               
               {/* Ring Chart Mock */}
               <div className="relative w-40 h-40 mt-8 mb-6 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                     <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                     {/* 35% of 251 circumference ≈ 88 */}
                     <circle cx="50" cy="50" r="40" stroke={trustStroke} strokeWidth="8" fill="none" strokeDasharray={trustDash} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-2">
                     <span className="text-4xl font-extrabold text-forensic-dark leading-none">{trustScore}</span>
                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{trustLabel}</span>
                  </div>
               </div>

               <div className="w-full space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                     <span className="font-medium text-gray-600">Fact Verification</span>
                     <span className={`font-bold ${factColor}`}>{factVerification}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="font-medium text-gray-600">Source Authority</span>
                     <span className={`font-bold ${sourceColor}`}>{sourceAuthority}</span>
                  </div>
               </div>

               <div className="w-full text-xs text-gray-500 text-center font-medium">
                Results are shown for demonstration.
              </div>
            </div>

            {/* Network Origin */}
            <div>
               <div className="flex items-center justify-between mb-4 mt-8 px-1">
                  <div className="flex items-center space-x-2">
                     <Globe className="w-5 h-5 text-gray-800" />
                     <h3 className="font-bold text-gray-900">Network Origin</h3>
                  </div>
                  <span className={`${domainBadgeClass} text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider`}>{domainBadgeText}</span>
               </div>
               
               <div className="space-y-3">
                  <div className={`bg-white p-4 rounded-xl border border-gray-200 border-l-4 ${domainRepBorder} shadow-sm relative`}>
                     <h4 className="font-bold text-gray-800 text-sm mb-1">Domain Reputation</h4>
                     <p className="text-xs text-gray-500 leading-relaxed">{domainRepText}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 border-l-4 border-l-green-400 shadow-sm relative">
                     <h4 className="font-bold text-gray-800 text-sm mb-1">WHOIS Transparency</h4>
                     <p className="text-xs text-gray-500 leading-relaxed">
                       {isBbc
                         ? 'Domain registration information appears consistent with an established publisher.'
                         : 'Domain registration details may be limited or masked, which can reduce transparency.'}
                     </p>
                  </div>
               </div>
            </div>

            {/* Linguistic Fingerprinting */}
            <div>
               <div className="flex items-center mb-4 mt-8 px-1">
                  <div className="flex items-center space-x-2">
                     <FileSpreadsheet className="w-5 h-5 text-gray-800" />
                     <h3 className="font-bold text-gray-900">Linguistic Fingerprinting</h3>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-4 rounded-xl border border-gray-200 border-l-4 border-l-red-500 shadow-sm">
                     <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Emotional Loading</div>
                     <div className="text-xl font-extrabold text-gray-900 mb-2">High</div>
                     <p className="text-[10px] text-red-600 font-medium leading-tight">Sensationalist adjectives detected: "outrageous", "terrifying", "secret".</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 border-l-4 border-l-green-400 shadow-sm">
                     <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Clickbait Score</div>
                     <div className="text-xl font-extrabold text-gray-900 mb-2">82%</div>
                     <p className="text-[10px] text-gray-500 font-medium leading-tight">Headline matches classic psychological trigger patterns.</p>
                  </div>
               </div>
            </div>

            {/* Ideological Bias */}
            <div>
               <div className="flex items-center mb-4 mt-8 px-1">
                  <div className="flex items-center space-x-2">
                     <BarChart2 className="w-5 h-5 text-gray-800" />
                     <h3 className="font-bold text-gray-900">Ideological Bias</h3>
                  </div>
               </div>

               <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                     <span>Left</span>
                     <span>Right</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden flex bg-gray-200 relative mb-4">
                     <div className="w-1/3 h-full bg-blue-500"></div>
                     <div className="w-1/6 h-full bg-white"></div>
                     <div className="w-1/2 h-full bg-red-400"></div>
                     <div className="absolute left-[70%] border-l-2 border-forensic-dark h-3 -mt-0.5"></div>
                  </div>
                  <p className="text-xs text-gray-500 text-center font-medium mb-6">Heavy right-leaning slant detected in source citation.</p>

                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 mt-4 w-full">Topic Heatmap</div>
                  <div className="grid grid-cols-3 gap-2 placeholder-heatmap">
                     <div className="aspect-square bg-red-200 rounded flex items-center justify-center text-red-700 opacity-60 hover:opacity-100 transition"><Hash className="w-5 h-5"/></div>
                     <div className="aspect-square bg-red-400 rounded flex items-center justify-center text-red-900 opacity-80 hover:opacity-100 transition"><ShieldAlert className="w-5 h-5"/></div>
                     <div className="aspect-square bg-red-100 rounded flex items-center justify-center text-red-700 opacity-60 hover:opacity-100 transition"><Globe className="w-5 h-5"/></div>
                     <div className="aspect-square bg-red-500 rounded flex items-center justify-center text-white opacity-90 transition"><ServerCrash className="w-5 h-5"/></div>
                     <div className="aspect-square bg-red-300 rounded flex items-center justify-center text-red-800 opacity-70 transition"><BarChart2 className="w-5 h-5"/></div>
                     <div className="aspect-square bg-red-400 rounded flex items-center justify-center text-red-900 opacity-80 transition"><Scan className="w-5 h-5"/></div>
                  </div>
               </div>
            </div>

            {/* Cross-Referenced Evidence */}
            <div className="mt-10">
               <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight w-1/2">Cross-Referenced Evidence</h3>
                  <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-right w-1/2 align-bottom mt-1">
                     2 Supporting • 8 Conflicting
                  </div>
               </div>

               <div className="space-y-4">
                  {/* Item 1 */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                     <div className="flex justify-between items-start mb-3">
                        <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center text-green-700">
                           <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="bg-green-100 text-green-800 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Confirmed Fact</span>
                     </div>
                     <h4 className="font-bold text-gray-900 text-sm mb-2">Independent audit confirms the reported spending figures are inaccurate.</h4>
                     <p className="text-xs text-gray-500 mb-3">Source: Associated Press, Reuters</p>
                     <div className="flex space-x-1">
                        <div className="w-4 h-3 bg-gray-200 rounded-sm"></div>
                        <div className="w-4 h-3 bg-gray-400 rounded-sm"></div>
                     </div>
                  </div>

                  {/* Item 2 */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                     <div className="flex justify-between items-start mb-3">
                        <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center text-red-600">
                           <AlertTriangle className="w-4 h-4" />
                        </div>
                        <span className="bg-red-50 text-red-800 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Contradiction</span>
                     </div>
                     <h4 className="font-bold text-gray-900 text-sm mb-2">Original source photo was manipulated; metadata shows 2018 timestamp.</h4>
                     <p className="text-xs text-gray-500 mb-4">Source: Forensic Image Lab</p>
                     <div className="w-full bg-gray-100 h-1.5 rounded flex">
                        <div className="bg-red-600 h-full w-[85%] rounded"></div>
                     </div>
                  </div>

                  {/* Item 3 */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                     <div className="flex justify-between items-start mb-3">
                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-600">
                           <LinkIcon className="w-4 h-4" />
                        </div>
                        <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Source Link</span>
                     </div>
                     <h4 className="font-bold text-gray-900 text-sm mb-2">Tracing lead back to primary government document release.</h4>
                     <p className="text-xs text-gray-500 mb-3">Analysis: Structural Link Matching</p>
                     <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default IntelligenceDashboard;
