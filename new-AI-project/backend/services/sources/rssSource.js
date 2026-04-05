// services/sources/rssSource.js

const Parser = require('rss-parser');
const { analyzeSentiment } = require('../sentimentService');
const { detectFakeNews } = require('../fakeNewsService');

const parser = new Parser();

const fetchRSS = async () => {
  try {
    const feed = await parser.parseURL("https://feeds.bbci.co.uk/news/rss.xml");
    console.log("✅ RSS fetched:", feed.items.length);

    return feed.items.map(item => {
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
        source: "BBC",
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