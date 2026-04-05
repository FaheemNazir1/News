import React from 'react';
import type { SentimentStats as SentimentStatsType } from '../types';

interface SentimentStatsProps {
  stats: SentimentStatsType | null;
  isLoading: boolean;
}

const SentimentStats: React.FC<SentimentStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const getPercentage = (count: number) => {
    return stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : '0';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Sentiment Analysis Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Articles</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.positive}</div>
          <div className="text-sm text-gray-600">Positive ({getPercentage(stats.positive)}%)</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.negative}</div>
          <div className="text-sm text-gray-600">Negative ({getPercentage(stats.negative)}%)</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.neutral}</div>
          <div className="text-sm text-gray-600">Neutral ({getPercentage(stats.neutral)}%)</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Distribution</h3>
        
        <div className="flex items-center">
          <div className="w-20 text-sm text-gray-600">Positive</div>
          <div className="flex-1 bg-gray-200 rounded-full h-6 mr-2">
            <div
              className="bg-green-500 h-6 rounded-full flex items-center justify-center text-xs text-white"
              style={{ width: `${getPercentage(stats.positive)}%` }}
            >
              {getPercentage(stats.positive)}%
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-20 text-sm text-gray-600">Negative</div>
          <div className="flex-1 bg-gray-200 rounded-full h-6 mr-2">
            <div
              className="bg-red-500 h-6 rounded-full flex items-center justify-center text-xs text-white"
              style={{ width: `${getPercentage(stats.negative)}%` }}
            >
              {getPercentage(stats.negative)}%
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-20 text-sm text-gray-600">Neutral</div>
          <div className="flex-1 bg-gray-200 rounded-full h-6 mr-2">
            <div
              className="bg-gray-500 h-6 rounded-full flex items-center justify-center text-xs text-white"
              style={{ width: `${getPercentage(stats.neutral)}%` }}
            >
              {getPercentage(stats.neutral)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentStats;
