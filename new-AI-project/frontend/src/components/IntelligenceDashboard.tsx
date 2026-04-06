import React, { useEffect, useMemo, useState } from 'react';
import { Scan } from 'lucide-react';

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
  const [isSpeakingSummary, setIsSpeakingSummary] = useState(false);

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

  const analyzedSource = typeof verifyResult?.source === 'string' ? verifyResult.source : '';
  const analyzedTitle = typeof verifyResult?.title === 'string' ? verifyResult.title : '';
  const analyzedSummary = Array.isArray(verifyResult?.summary) ? verifyResult.summary : null;
  const analyzedSentiment = typeof verifyResult?.sentiment === 'string' ? verifyResult.sentiment : '';
  const analyzedVerdict = typeof verifyResult?.verdict === 'string' ? verifyResult.verdict : '';
  const analyzedConfidence = typeof verifyResult?.confidence === 'string' ? verifyResult.confidence : '';
  const analyzedReason = Array.isArray(verifyResult?.reason) ? verifyResult.reason : null;
  const analyzedReasons = Array.isArray(verifyResult?.reasons) ? verifyResult.reasons : null;
  const credibilityLevel = typeof verifyResult?.credibilityLevel === 'string' ? verifyResult.credibilityLevel : '';

  const credibilityBadge = (() => {
    const level = (credibilityLevel || '').toLowerCase();
    if (level === 'trusted') return { text: 'Trusted', cls: 'bg-green-100 text-green-800' };
    if (level === 'medium') return { text: 'Medium', cls: 'bg-yellow-100 text-yellow-800' };
    if (level) return { text: level, cls: 'bg-red-100 text-red-800' };
    return { text: 'Unknown', cls: 'bg-red-100 text-red-800' };
  })();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingSummary(false);
  }, [analyzedUrl]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakVerificationSummary = () => {
    if (!analyzedSummary || !analyzedSummary.length) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const text = analyzedSummary.slice(0, 4).join(' ');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = () => setIsSpeakingSummary(false);
    utterance.onerror = () => setIsSpeakingSummary(false);
    setIsSpeakingSummary(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopVerificationSummary = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeakingSummary(false);
  };

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

  const trustBar = (() => {
    if (trustScore >= 70) return { cls: 'bg-green-500', track: 'bg-green-100' };
    if (trustScore >= 30) return { cls: 'bg-yellow-500', track: 'bg-yellow-100' };
    return { cls: 'bg-red-500', track: 'bg-red-100' };
  })();

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
                <div className="flex items-center justify-between mt-2 gap-3">
                  <div className="text-xs text-gray-500">Source: {analyzedSource || effectiveHostname || 'Unknown'}</div>
                  <span className={`${credibilityBadge.cls} text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider`}>{credibilityBadge.text}</span>
                </div>
              ) : (
                <div className="text-xs text-gray-500 mt-1">
                  Note: This screen currently shows demo-style results. To generate unique results per link, we need to connect it to a backend analysis endpoint.
                </div>
              )}
            </div>

            {verifyResult && (analyzedTitle || analyzedSummary || analyzedVerdict) ? (
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                {analyzedTitle ? (
                  <div className="text-lg font-extrabold text-gray-900 leading-snug">{analyzedTitle}</div>
                ) : null}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-gray-200 p-3">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sentiment</div>
                    <div className="mt-1 text-sm font-semibold text-gray-900">{analyzedSentiment || '—'}</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-3">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verdict</div>
                    <div className="mt-1 text-sm font-semibold text-gray-900">{analyzedVerdict || '—'}</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-3">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confidence</div>
                    <div className="mt-1 text-sm font-semibold text-gray-900">{analyzedConfidence || '—'}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trust Score</div>
                    <div className="text-xs font-extrabold text-gray-900">{Math.max(0, Math.min(100, trustScore))}/100</div>
                  </div>
                  <div className={`w-full h-2 rounded-full ${trustBar.track} overflow-hidden`}>
                    <div className={`h-full ${trustBar.cls}`} style={{ width: `${Math.max(0, Math.min(100, trustScore))}%` }} />
                  </div>
                </div>

                {analyzedSummary && analyzedSummary.length ? (
                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Summary</div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={speakVerificationSummary}
                          disabled={!analyzedSummary.length || isSpeakingSummary}
                          className="text-xs font-bold text-forensic-blue hover:text-forensic-dark transition-colors disabled:opacity-50"
                        >
                          Play
                        </button>
                        <button
                          type="button"
                          onClick={stopVerificationSummary}
                          disabled={!isSpeakingSummary}
                          className="text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
                        >
                          Stop
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed">{analyzedSummary.slice(0, 4).join(' ')}</div>
                  </div>
                ) : null}

                {(analyzedReasons && analyzedReasons.length) || (analyzedReason && analyzedReason.length) ? (
                  <div className="mt-4">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Reason</div>
                    <div className="space-y-2">
                      {(analyzedReasons || analyzedReason || []).slice(0, 4).map((r: string, idx: number) => (
                        <div key={idx} className="text-sm text-gray-700 leading-relaxed">- {r}</div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

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
         </div>
      )}
    </div>
  );
};

export default IntelligenceDashboard;
