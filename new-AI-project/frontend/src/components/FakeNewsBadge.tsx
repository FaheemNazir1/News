import React from 'react';
import { Article } from '../types';

interface FakeNewsBadgeProps {
  article: Article;
  showDetails?: boolean;
}

const FakeNewsBadge: React.FC<FakeNewsBadgeProps> = ({ article, showDetails = false }) => {
  const getFakeNewsColor = (fakeScore: number) => {
    if (fakeScore >= 40) return 'bg-red-500';
    if (fakeScore >= 30) return 'bg-orange-500';
    if (fakeScore >= 20) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getFakeNewsText = (fakeScore: number) => {
    if (fakeScore >= 40) return 'FAKE';
    if (fakeScore >= 30) return 'Likely Fake';
    if (fakeScore >= 20) return 'Suspicious';
    return 'Reliable';
  };

  const getReasonText = (reason: string) => {
    const reasonMap: Record<string, string> = {
      'single_source': 'Single Source',
      'extreme_sentiment': 'Extreme Sentiment',
      'clickbait_keywords': 'Clickbait Keywords',
      'sensational_language': 'Sensational Language',
      'unreliable_source': 'Unreliable Source'
    };
    return reasonMap[reason] || reason;
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getFakeNewsColor(article.fakeScore)}`}>
          {getFakeNewsText(article.fakeScore)}
        </span>
        <span className="text-xs text-gray-500">
          Score: {article.fakeScore}/100
        </span>
        <span className={`text-xs font-medium ${getCredibilityColor(article.credibilityScore)}`}>
          Credibility: {article.credibilityScore}%
        </span>
      </div>
      
      {showDetails && article.fakeReasons.length > 0 && (
        <div className="text-xs text-gray-600">
          <div className="font-medium mb-1">Detection Reasons:</div>
          <div className="flex flex-wrap gap-1">
            {article.fakeReasons.map((reason, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 rounded text-gray-700"
              >
                {getReasonText(reason)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FakeNewsBadge;
