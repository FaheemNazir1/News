import React from 'react';
import ArticleCard from './ArticleCard';
import { Article } from '../types';

interface ArticleListProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, loading, error }) => {
  if (loading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-600 text-lg mb-2">⚠️ Error</div>
          <div className="text-red-800">{error}</div>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="p-8">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📰</div>
          <div className="text-gray-600 text-lg mb-2">No articles found</div>
          <div className="text-gray-500">Try fetching some fresh news to get started</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default ArticleList;
