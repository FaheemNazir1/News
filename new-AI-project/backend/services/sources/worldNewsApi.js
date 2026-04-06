const axios = require('axios');
const { analyzeSentiment } = require('../sentimentService');

const fetchWorldNewsAPI = async (apiKey, keyword = '') => {
  try {
    if (!apiKey) {
      return [];
    }

    const q = (keyword || '').toString().trim();

    const endpoint = q ? 'https://api.worldnewsapi.com/search-news' : 'https://api.worldnewsapi.com/top-news';
    const params = q
      ? {
          text: q,
          language: 'en',
          number: 20
        }
      : {
          'source-country': 'us',
          language: 'en'
        };

    const response = await axios.get(endpoint, {
      params,
      headers: {
        'x-api-key': apiKey
      },
      timeout: 15000
    });

    const items = q ? response?.data?.news : response?.data?.top_news;
    if (!items) return [];

    const flatNews = Array.isArray(items)
      ? (q
          ? items
          : items.flatMap((cluster) => (Array.isArray(cluster?.news) ? cluster.news : [])))
      : [];

    return flatNews.slice(0, 20).map((item) => {
      const title = item.title || '';
      const content = item.summary || item.text || 'No content available';
      const url = item.url || item.link || '';
      const author = item.author || item.authors || '';

      const sentimentAnalysis = analyzeSentiment(`${title} ${content}`);

      return {
        title,
        content,
        source: item.source_country || item.source || 'WorldNewsAPI',
        url,
        author: typeof author === 'string' ? author : '',
        sentiment: sentimentAnalysis.sentiment,
        score: sentimentAnalysis.score,
        publishedAt: item.publish_date ? new Date(item.publish_date) : new Date(),
        publishDate: item.publish_date ? new Date(item.publish_date).toISOString() : ''
      };
    });
  } catch (error) {
    console.error('WorldNewsAPI error:', error.response?.data || error.message);
    return [];
  }
};

module.exports = fetchWorldNewsAPI;
