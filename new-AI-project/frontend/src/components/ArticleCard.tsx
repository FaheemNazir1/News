import React, { useEffect, useMemo, useState } from 'react';
import { Article } from '../types';
import FakeNewsBadge from './FakeNewsBadge';
import { articleService } from '../services/api';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [showSummary, setShowSummary] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<{
    title: string;
    summary: string[];
  } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      case 'neutral':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const credibilityLevel = (article.credibilityLevel || '').toString();
  const credibilityBadge = (() => {
    const level = credibilityLevel || 'Unknown';
    if (level.toLowerCase() === 'trusted') return { text: 'Trusted', cls: 'bg-green-100 text-green-800' };
    if (level.toLowerCase() === 'medium') return { text: 'Medium', cls: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Low', cls: 'bg-red-100 text-red-800' };
  })();

  const trustScore = typeof article.trustScore === 'number'
    ? article.trustScore
    : typeof article.credibilityScore === 'number'
      ? Math.max(0, Math.min(100, Math.round(article.credibilityScore)))
      : 0;

  const trustBar = (() => {
    if (trustScore >= 70) return { cls: 'bg-green-500', track: 'bg-green-100' };
    if (trustScore >= 30) return { cls: 'bg-yellow-500', track: 'bg-yellow-100' };
    return { cls: 'bg-red-500', track: 'bg-red-100' };
  })();

  const suspiciousTerms = useMemo(() => {
    return [
      'shocking',
      'unbelievable',
      'incredible',
      'must read',
      'exclusive',
      'revealed',
      'secret',
      'urgent',
      'breaking',
      'warning',
      'deadly',
      'catastrophic',
      'devastating',
      'unprecedented',
      'massive',
      'crisis',
      'scandal',
      'controversy'
    ];
  }, []);

  const highlightedSnippet = useMemo(() => {
    const text = (article.content || '').toString();
    if (!text) return null;

    const escaped = suspiciousTerms
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .sort((a, b) => b.length - a.length);
    if (!escaped.length) return <>{text}</>;

    const re = new RegExp(`(${escaped.join('|')})`, 'gi');
    const parts = text.split(re);
    return (
      <>
        {parts.map((p, idx) => {
          const isHit = suspiciousTerms.some((t) => t.toLowerCase() === p.toLowerCase());
          if (!isHit) return <React.Fragment key={idx}>{p}</React.Fragment>;
          return (
            <mark
              key={idx}
              className="bg-yellow-200 text-gray-900 px-1 rounded"
            >
              {p}
            </mark>
          );
        })}
      </>
    );
  }, [article.content, suspiciousTerms]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeakSummary = () => {
    if (!aiSummary?.summary?.length) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const text = aiSummary.summary.join(' ');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const summarizeInput = useMemo(() => {
    const raw = (article.content || '').replace(/\s+/g, ' ').trim();
    if (raw && raw !== 'No content available') return raw;
    return (article.title || '').trim();
  }, [article.content, article.title]);

  const handleToggleSummary = async () => {
    const next = !showSummary;
    setShowSummary(next);

    if (!next) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }

    if (!next) return;
    if (aiSummary) return;
    if (!summarizeInput) {
      setSummaryError('No text available to summarize');
      return;
    }

    setSummaryLoading(true);
    setSummaryError(null);
    try {
      if (article.url && /^https?:\/\//i.test(article.url)) {
        const result = await articleService.summarizeUrl(article.url);
        setAiSummary(result);
      } else {
        const result = await articleService.summarizeArticle(summarizeInput);
        setAiSummary(result);
      }
    } catch (e: any) {
      try {
        const fallback = await articleService.summarizeArticle(summarizeInput);
        setAiSummary(fallback);
      } catch (inner: any) {
        const msg = inner?.response?.data?.error || e?.response?.data?.error || inner?.message || e?.message || 'Summarization failed';
        setSummaryError(msg);
      }
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {article.source}
          </span>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${credibilityBadge.cls}`}>
            {credibilityBadge.text}
          </span>
          {article.keyword ? (
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {article.keyword}
            </span>
          ) : null}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSentimentColor(article.sentiment)}`}>
          {article.sentiment}
        </span>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
        >
          {article.title}
        </a>
      </h3>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
        {highlightedSnippet}
      </p>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-semibold text-gray-500">Trust Score</div>
          <div className="text-xs font-bold text-gray-700">{trustScore}/100</div>
        </div>
        <div className={`w-full h-2 rounded-full ${trustBar.track} overflow-hidden`}>
          <div className={`h-full ${trustBar.cls}`} style={{ width: `${trustScore}%` }} />
        </div>
      </div>
      
      <div className="mb-4">
        <FakeNewsBadge article={article} showDetails={true} />
      </div>

      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors"
        >
          {showDetails ? 'Hide details' : 'View details'}
        </button>

        {showDetails ? (
          <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Verdict</div>
                <div className="text-sm font-bold text-gray-900">{article.verdict || (article.isFake ? 'Fake' : 'Uncertain')}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Confidence</div>
                <div className="text-sm font-bold text-gray-900">{article.confidence || `${trustScore}%`}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Evidence</div>
                <div className="text-sm text-gray-800">
                  {article.url ? 'Has source link' : 'No source link'}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Detection reasons</div>
              {Array.isArray(article.reasons) && article.reasons.length ? (
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                  {article.reasons.slice(0, 6).map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              ) : Array.isArray(article.fakeReasons) && article.fakeReasons.length ? (
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                  {article.fakeReasons.slice(0, 6).map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-600">No reasons available</div>
              )}
            </div>

            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Emotional tone</div>
              <div className="text-sm text-gray-800 capitalize">{article.sentiment || 'neutral'}</div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mb-4">
        <button
          type="button"
          onClick={handleToggleSummary}
          className="text-sm font-bold text-forensic-blue hover:text-forensic-dark transition-colors"
        >
          {showSummary ? 'Hide summary' : 'Summarize'}
        </button>
        {showSummary && (
          <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Summary</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSpeakSummary}
                  disabled={summaryLoading || !!summaryError || !aiSummary?.summary?.length || isSpeaking}
                  className="text-xs font-bold text-forensic-blue hover:text-forensic-dark transition-colors disabled:opacity-50"
                >
                  Play
                </button>
                <button
                  type="button"
                  onClick={handleStopSpeaking}
                  disabled={!isSpeaking}
                  className="text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
                >
                  Stop
                </button>
              </div>
            </div>
            {summaryLoading ? (
              <div className="text-sm text-gray-700 leading-relaxed">Generating summary…</div>
            ) : summaryError ? (
              <div className="text-sm text-red-700 leading-relaxed">{summaryError}</div>
            ) : aiSummary ? (
              <div className="text-sm text-gray-700 leading-relaxed">
                {Array.isArray(aiSummary.summary) && aiSummary.summary.length ? (
                  <div>{aiSummary.summary.join(' ')}</div>
                ) : (
                  <div>No summary available</div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-700 leading-relaxed">No summary available</div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-100">
        <span>Sentiment: {article.score.toFixed(2)}</span>
        <span>{formatDate(article.publishDate || article.publishedAt)}</span>
      </div>
    </div>
  );
};

export default ArticleCard;
