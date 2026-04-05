// services/sources/newsApi.js

const axios = require('axios');
const { analyzeSentiment } = require('../sentimentService');

const fetchNewsAPI = async (apiKey, category = 'general', country = 'us') => {
  try {
   
    const response = await axios.get("https://newsapi.org/v2/everything", {
  params: {
    q: "news",              // keyword
    sortBy: "publishedAt",  // latest first
    language: "en",
    apiKey,
    pageSize: 20
  }
});

    return response.data.articles.map(article => {
      const sentimentAnalysis = analyzeSentiment(
        (article.title || '') + ' ' + (article.description || '')
      );

      return {
        title: article.title,
        content: article.description || article.content || 'No content available',
        source: article.source.name || "NewsAPI",
        url: article.url,
        sentiment: sentimentAnalysis.sentiment,
        score: sentimentAnalysis.score,
        publishedAt: new Date(article.publishedAt)
      };
    });

  } catch (error) {
    console.error('NewsAPI error:', error.response?.data || error.message);
    return []; // ⚠️ important: don't crash aggregator
  }
};

module.exports = fetchNewsAPI;