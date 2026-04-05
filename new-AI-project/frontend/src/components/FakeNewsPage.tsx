import React, { useState, useEffect, useCallback } from 'react';
import { Article, FakeNewsStats as FakeNewsStatsType } from '../types';
import { articleService } from '../services/api';
import ArticleCard from './ArticleCard';
import FakeNewsStats from './FakeNewsStats';

const FakeNewsPage: React.FC = () => {
  const [fakeArticles, setFakeArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<FakeNewsStatsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'fake' | 'likely_fake' | 'suspicious'>('all');

  const fetchFakeNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all articles first
      const response = await articleService.getArticles({ page: 1, limit: 100 });
      const allArticles = response.articles;
      
      // Filter articles based on fake news criteria
      let filteredArticles = allArticles;
      
      switch (filter) {
        case 'fake':
          filteredArticles = allArticles.filter(article => article.isFake);
          break;
        case 'likely_fake':
          filteredArticles = allArticles.filter(article => article.fakeScore >= 30 && !article.isFake);
          break;
        case 'suspicious':
          filteredArticles = allArticles.filter(article => article.fakeScore >= 20 && article.fakeScore < 30);
          break;
        default:
          filteredArticles = allArticles;
      }
      
      // Sort by fake score (highest first)
      filteredArticles.sort((a, b) => b.fakeScore - a.fakeScore);
      
      setFakeArticles(filteredArticles);
      
      // Calculate fake news statistics
      const fakeNewsStats: FakeNewsStatsType = {
        total: allArticles.length,
        fake: allArticles.filter(a => a.isFake).length,
        likelyFake: allArticles.filter(a => a.fakeScore >= 30 && !a.isFake).length,
        highlySuspicious: allArticles.filter(a => a.fakeScore >= 20 && a.fakeScore < 30).length,
        averageFakeScore: allArticles.reduce((sum, a) => sum + a.fakeScore, 0) / allArticles.length,
        fakeReasonsDistribution: allArticles.reduce((acc, article) => {
          article.fakeReasons.forEach(reason => {
            acc[reason] = (acc[reason] || 0) + 1;
          });
          return acc;
        }, {} as Record<string, number>),
        sentimentDistribution: {
          positive: allArticles.filter(a => a.sentiment === 'positive').length,
          negative: allArticles.filter(a => a.sentiment === 'negative').length,
          neutral: allArticles.filter(a => a.sentiment === 'neutral').length,
        }
      };
      
      setStats(fakeNewsStats);
    } catch (err: any) {
      setError(`Failed to fetch fake news analysis: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchFakeNews();
  }, [fetchFakeNews]);

  const getFilterCount = (filterType: string) => {
    if (!stats) return 0;
    
    switch (filterType) {
      case 'fake': return stats.fake;
      case 'likely_fake': return stats.likelyFake;
      case 'suspicious': return stats.highlySuspicious;
      default: return stats.total;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚨 Fake News Detection
          </h1>
          <p className="text-lg text-gray-600">
            Advanced analysis and detection of potentially fake or misleading news articles
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Articles', color: 'bg-gray-500' },
            { key: 'fake', label: 'Fake News', color: 'bg-red-500' },
            { key: 'likely_fake', label: 'Likely Fake', color: 'bg-orange-500' },
            { key: 'suspicious', label: 'Suspicious', color: 'bg-yellow-500' }
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === key
                  ? `${color} text-white`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label} ({getFilterCount(key)})
            </button>
          ))}
        </div>
        
        <div className="text-sm text-gray-600 mt-3">
          Showing {fakeArticles.length} articles with fake news analysis
        </div>
      </div>

      {/* Fake News Statistics */}
      <FakeNewsStats stats={stats} isLoading={loading} />

      {/* Error Message */}
      {error && (
        <div className="mx-8 mt-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="text-red-800">{error}</div>
          </div>
        </div>
      )}

      {/* Fake News Articles */}
      <div className="px-8 py-6">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              {filter === 'all' && 'All Articles (Sorted by Fake Score)'}
              {filter === 'fake' && 'Detected Fake News'}
              {filter === 'likely_fake' && 'Likely Fake Articles'}
              {filter === 'suspicious' && 'Suspicious Articles'}
            </h2>
          </div>
          
          {loading ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : fakeArticles.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <p className="text-gray-600 mb-2">No articles found for the selected filter.</p>
              <p className="text-gray-500 text-sm">Try fetching some news articles first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {fakeArticles.map(article => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FakeNewsPage;
