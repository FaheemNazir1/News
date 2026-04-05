import React from 'react';
import StatCard from './StatCard';
import SentimentStats from './SentimentStats';
import FakeNewsStats from './FakeNewsStats';
import { SentimentStats as SentimentStatsType, FakeNewsStats as FakeNewsStatsType } from '../types';

interface DashboardProps {
  sentimentStats: SentimentStatsType | null;
  fakeStats: FakeNewsStatsType | null;
  isLoading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ sentimentStats, fakeStats, isLoading }) => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Real-time news sentiment and fake news analysis</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Articles"
          value={sentimentStats?.total || 0}
          color="blue"
          icon="📰"
        />
        <StatCard
          title="Positive Sentiment"
          value={sentimentStats?.positive || 0}
          subtitle={`${((sentimentStats?.positive || 0) / (sentimentStats?.total || 1) * 100).toFixed(1)}%`}
          color="green"
          icon="😊"
        />
        <StatCard
          title="Negative Sentiment"
          value={sentimentStats?.negative || 0}
          subtitle={`${((sentimentStats?.negative || 0) / (sentimentStats?.total || 1) * 100).toFixed(1)}%`}
          color="red"
          icon="😔"
        />
        <StatCard
          title="Fake Articles"
          value={fakeStats?.fake || 0}
          subtitle={`${((fakeStats?.fake || 0) / (fakeStats?.total || 1) * 100).toFixed(1)}%`}
          color="orange"
          icon="🚨"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SentimentStats stats={sentimentStats} isLoading={isLoading} />
        <FakeNewsStats stats={fakeStats} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Dashboard;
