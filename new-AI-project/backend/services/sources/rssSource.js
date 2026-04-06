// services/sources/rssSource.js

const Parser = require('rss-parser');
const { analyzeSentiment } = require('../sentimentService');
const { detectFakeNews } = require('../fakeNewsService');

const parser = new Parser();

const fetchRSS = async (keyword = '') => {
  try {
    const q = (keyword || '').toString().trim();

    const feeds = [
      { name: 'BBC', url: 'https://feeds.bbci.co.uk/news/rss.xml' },
      { name: 'Reuters', url: 'https://feeds.reuters.com/reuters/topNews' },
      { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml' },
      { name: 'NYT', url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml' }
    ];

    if (q) {
      const encoded = encodeURIComponent(q);
      feeds.unshift({
        name: 'Google News',
        url: `https://news.google.com/rss/search?q=${encoded}&hl=en&gl=US&ceid=US:en`
      });
    }

    const parsed = await Promise.all(
      feeds.map(async (f) => {
        try {
          const feed = await parser.parseURL(f.url);
          return { source: f.name, items: Array.isArray(feed.items) ? feed.items : [] };
        } catch (e) {
          console.error('RSS error:', f.name, e.message);
          return { source: f.name, items: [] };
        }
      })
    );

    const allItems = parsed.flatMap((p) => p.items.map((it) => ({ ...it, __source: p.source })));
    console.log('✅ RSS fetched:', allItems.length);

    const seen = new Set();
    const uniqueItems = [];
    for (const item of allItems) {
      const key = `${(item.title || '').toLowerCase().trim()}|${(item.link || '').toLowerCase().trim()}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueItems.push(item);
      }
    }

    return uniqueItems.map(item => {
      const sentimentAnalysis = analyzeSentiment(
        (item.title || '') + ' ' + (item.contentSnippet || '')
      );

      const fakeNewsDetection = detectFakeNews({
        title: item.title,
        content: item.contentSnippet || 'No content',
        sentiment: sentimentAnalysis.sentiment,
        score: sentimentAnalysis.score
      });

      return {
        title: item.title,
        content: item.contentSnippet || 'No content',
        source: item.__source || 'RSS',
        url: item.link,
        sentiment: sentimentAnalysis.sentiment,
        score: sentimentAnalysis.score,
        fakeScore: fakeNewsDetection.fakeScore,
        isFake: fakeNewsDetection.isFake,
        fakeReasons: fakeNewsDetection.fakeReasons,
        credibilityScore: fakeNewsDetection.credibilityScore,
        publishedAt: new Date(item.pubDate)
      };
    });

  } catch (error) {
    console.error('RSS error:', error.message);
    return [];
  }
};

module.exports = fetchRSS;