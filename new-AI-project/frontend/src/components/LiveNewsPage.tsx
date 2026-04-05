import React, { useCallback, useEffect, useState } from 'react';
import { articleService } from '../services/api';
import { Article } from '../types';
import ArticleList from './ArticleList';

const REFRESH_INTERVAL_MS = 30000;

const LiveNewsPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('news');
  const [activeKeyword, setActiveKeyword] = useState('news');

  const fetchLiveNews = useCallback(async (q?: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await articleService.getLiveNews(q);
      setArticles(response.articles || []);
      setActiveKeyword((response.keyword || q || 'news').toString());
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Failed to fetch live news');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveNews(activeKeyword);
  }, [fetchLiveNews, activeKeyword]);

  useEffect(() => {
    const q = keyword.trim();
    const timer = setTimeout(() => {
      const next = q ? q : 'news';
      if (next !== activeKeyword) {
        setActiveKeyword(next);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword, activeKeyword]);

  const handleSearch = () => {
    const q = keyword.trim();
    const next = q ? q : 'news';
    setActiveKeyword(next);
    fetchLiveNews(next);
  };

  const handleClear = () => {
    setKeyword('news');
    setActiveKeyword('news');
    fetchLiveNews('news');
  };

  return (
    <div className="bg-[#F4F5F7] min-h-screen font-sans pb-28 pt-8 px-4">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-forensic-dark tracking-tight leading-tight">
            Live News
          </h1>
          <div className="text-sm text-gray-500 mt-1">
            {lastUpdated ? ` • Last updated: ${lastUpdated}` : ''}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Keyword: <span className="font-semibold text-gray-700">{activeKeyword}</span>
          </div>
        </div>

        <button
          onClick={() => fetchLiveNews(activeKeyword)}
          disabled={loading}
          className="bg-forensic-dark text-white rounded-xl px-4 py-2.5 text-sm font-bold hover:bg-forensic-darker transition-colors disabled:opacity-50"
        >
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-forensic-blue focus:border-transparent transition-all outline-none font-medium placeholder-gray-400 shadow-sm"
            placeholder="Search by keyword (e.g., elections, tech, sports)"
          />
          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-forensic-blue text-white rounded-xl px-5 py-3 text-sm font-bold hover:bg-forensic-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Searching…' : 'Search'}
            </button>
            <button
              onClick={handleClear}
              disabled={loading}
              className="bg-white text-gray-700 rounded-xl px-5 py-3 text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Tip: results auto-update as you type (500ms delay). Press Enter to search instantly.
        </div>
      </div>

      <ArticleList articles={articles} loading={loading} error={error} />
    </div>
  );
};

export default LiveNewsPage;
