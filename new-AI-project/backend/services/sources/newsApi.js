// services/sources/newsApi.js

const axios = require('axios');
const { analyzeSentiment } = require('../sentimentService');

const fetchNewsAPI = async (apiKey, keyword = '') => {
  try {
    if (!apiKey) {
      return [];
    }
    const q = (keyword || '').toString().trim();

    const endpoint = q ? 'https://newsapi.org/v2/everything' : 'https://newsapi.org/v2/top-headlines';
    const params = q
      ? {
          q,
          sortBy: 'publishedAt',
          language: 'en',
          apiKey,
          pageSize: 20
        }
      : {
          country: 'us',
          apiKey,
          pageSize: 20
        };

    const response = await axios.get(endpoint, { params });

    return response.data.articles.map(article => {
      const sentimentAnalysis = analyzeSentiment(
        (article.title || '') + ' ' + (article.description || '')
      );

      return {
        title: article.title,
        content: article.description || article.content || 'No content available',
        source: article.source.name || "NewsAPI",
        url: article.url,
        author: article.author || '',
        sentiment: sentimentAnalysis.sentiment,
        score: sentimentAnalysis.score,
        publishedAt: new Date(article.publishedAt),
        publishDate: article.publishedAt ? new Date(article.publishedAt).toISOString() : ''
      };
    });

  } catch (error) {
    console.error('NewsAPI error:', error.response?.data || error.message);
    return []; // ⚠️ important: don't crash aggregator
  }
};

module.exports = fetchNewsAPI;