import axios from 'axios';
import { Article, ArticlesResponse, SentimentStats, FakeNewsStats } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const articleService = {
  getArticles: async (params?: {
    page?: number;
    limit?: number;
    sentiment?: string;
    search?: string;
  }): Promise<ArticlesResponse> => {
    try {
      const response = await api.get('/articles', { params });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  fetchAndStoreArticles: async (): Promise<{ message: string; articles: Article[] }> => {
    try {
      const response = await api.post('/articles/fetch');
      return response.data;
    } catch (error) {
      console.error('Fetch Error:', error);
      throw error;
    }
  },

  getLiveNews: async (q?: string): Promise<{ keyword?: string; articles: Article[] }> => {
    try {
      const response = await api.get('/articles/live', {
        params: q ? { keyword: q } : undefined
      });
      return response.data;
    } catch (error) {
      console.error('Live News Error:', error);
      throw error;
    }
  },

  getSentimentStats: async (): Promise<SentimentStats> => {
    try {
      const response = await api.get('/articles/sentiment/stats');
      return response.data;
    } catch (error) {
      console.error('Stats Error:', error);
      throw error;
    }
  },

  getFakeNewsStats: async (): Promise<FakeNewsStats> => {
    try {
      const response = await api.get('/articles/fake/stats');
      return response.data;
    } catch (error) {
      console.error('Fake News Stats Error:', error);
      throw error;
    }
  },

  getFakeNewsArticles: async (params?: {
    page?: number;
    limit?: number;
    fakeLevel?: string;
  }): Promise<ArticlesResponse> => {
    try {
      const response = await api.get('/articles/fake', { params });
      return response.data;
    } catch (error) {
      console.error('Fake News Articles Error:', error);
      throw error;
    }
  },

  verifyLink: async (url: string): Promise<{
    url: string;
    hostname: string;
    isBbc: boolean;
    trustScore: number;
    trustLabel: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    fakeScore: number;
    isFake: boolean;
    fakeReasons: string[];
    credibilityScore: number;
    factVerification: number;
    sourceAuthority: number;
  }> => {
    try {
      const response = await api.post('/verify/link', { url });
      return response.data;
    } catch (error) {
      console.error('Verify Link Error:', error);
      throw error;
    }
  },

  analyzeUrl: async (url: string): Promise<{
    source: string;
    title: string;
    summary: string[];
    sentiment: string;
    verdict: string;
    confidence: string;
    reason: string[];
  }> => {
    try {
      const response = await api.post('/analyze-url', { url });
      return response.data;
    } catch (error) {
      console.error('Analyze URL Error:', error);
      throw error;
    }
  },

  summarizeArticle: async (article: string): Promise<{
    title: string;
    summary: string[];
  }> => {
    try {
      const response = await api.post('/summarize', { article });
      return response.data;
    } catch (error) {
      console.error('Summarize Error:', error);
      throw error;
    }
  },

  summarizeUrl: async (url: string): Promise<{
    title: string;
    summary: string[];
  }> => {
    try {
      const response = await api.post('/summarize', { url });
      return response.data;
    } catch (error) {
      console.error('Summarize URL Error:', error);
      throw error;
    }
  },
};
