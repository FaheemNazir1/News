import React, { useMemo, useState } from 'react';
import { Article } from '../types';
import FakeNewsBadge from './FakeNewsBadge';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [showSummary, setShowSummary] = useState(false);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const summary = useMemo(() => {
    const raw = (article.content || '').replace(/\s+/g, ' ').trim();
    const base = raw && raw !== 'No content available' ? raw : (article.title || '').trim();
    if (!base) return '';

    const sentences = base.split(/(?<=[.!?])\s+/).filter(Boolean);
    const picked = sentences.slice(0, 2).join(' ');
    const trimmed = picked.length > 260 ? picked.slice(0, 257).trimEnd() + '…' : picked;
    return trimmed;
  }, [article.content, article.title]);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {article.source}
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
        {article.content}
      </p>
      
      <div className="mb-4">
        <FakeNewsBadge article={article} showDetails={true} />
      </div>

      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowSummary((v) => !v)}
          className="text-sm font-bold text-forensic-blue hover:text-forensic-dark transition-colors"
        >
          {showSummary ? 'Hide summary' : 'Summarize'}
        </button>
        {showSummary && (
          <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Summary</div>
            <div className="text-sm text-gray-700 leading-relaxed">{summary || 'No summary available'}</div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-100">
        <span>Sentiment: {article.score.toFixed(2)}</span>
        <span>{formatDate(article.publishedAt)}</span>
      </div>
    </div>
  );
};

export default ArticleCard;
