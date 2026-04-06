export interface Article {
  _id: string;
  title: string;
  content: string;
  source: string;
  url: string;
  keyword?: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  fakeScore: number;
  isFake: boolean;
  fakeReasons: string[];
  credibilityScore: number;
  trustScore?: number;
  verdict?: string;
  confidence?: string;
  reasons?: string[];
  credibilityLevel?: 'Trusted' | 'Medium' | 'Unknown' | string;
  publishDate?: string;
  author?: string;
  publishedAt: string;
  createdAt: string;
}

export interface ArticlesResponse {
  articles: Article[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface SentimentStats {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
}

export interface FakeNewsStats {
  total: number;
  fake: number;
  likelyFake: number;
  highlySuspicious: number;
  averageFakeScore: number;
  fakeReasonsDistribution: {
    [key: string]: number;
  };
  sentimentDistribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
