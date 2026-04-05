import React from 'react';
import { FakeNewsStats as FakeNewsStatsType } from '../types';

interface FakeNewsStatsProps {
  stats: FakeNewsStatsType | null;
  isLoading: boolean;
}

const FakeNewsStats: React.FC<FakeNewsStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Fake News Analysis</h3>
        <p className="text-gray-500">No fake news statistics available</p>
      </div>
    );
  }

  const fakePercentage = stats.total > 0 ? (stats.fake / stats.total) * 100 : 0;
  const suspiciousPercentage = stats.total > 0 ? ((stats.fake + stats.likelyFake) / stats.total) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">🚨 Fake News Analysis</h3>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Articles</div>
        </div>
        
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{stats.fake}</div>
          <div className="text-sm text-gray-600">Fake ({fakePercentage.toFixed(1)}%)</div>
        </div>
        
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{stats.likelyFake}</div>
          <div className="text-sm text-gray-600">Likely Fake</div>
        </div>
        
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{stats.highlySuspicious}</div>
          <div className="text-sm text-gray-600">Suspicious</div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Fake News Rate</span>
            <span className="font-medium">{fakePercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${fakePercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Suspicious Content Rate</span>
            <span className="font-medium">{suspiciousPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${suspiciousPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Fake Reasons Distribution */}
      {Object.keys(stats.fakeReasonsDistribution).length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-700 mb-3">Detection Reasons</h4>
          <div className="space-y-2">
            {Object.entries(stats.fakeReasonsDistribution).map(([reason, count]: [string, number]) => {
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={reason} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">
                    {reason.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Average Fake Score */}
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-3xl font-bold text-gray-800">{stats.averageFakeScore.toFixed(1)}</div>
        <div className="text-sm text-gray-600">Average Fake Score</div>
        <div className="text-xs text-gray-500 mt-1">Lower is better (0-100)</div>
      </div>
    </div>
  );
};

export default FakeNewsStats;
