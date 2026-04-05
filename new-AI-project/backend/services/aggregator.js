const fetchNewsAPI = require('./sources/newsApi');
const fetchRSS = require('./sources/rssSource');
const { analyzeFakeNewsPatterns } = require('./fakeNewsService');

const normalizeTitle = (title) =>
  title?.toLowerCase().replace(/[^\w\s]/gi, '').trim();

const aggregateNews = async (apiKey) => {
  const [apiNews, rssNews] = await Promise.all([
    fetchNewsAPI(apiKey),
    fetchRSS()
  ]);

  const allNews = [...apiNews, ...rssNews];

  const seen = new Set();
  const uniqueNews = [];

  for (let article of allNews) {
    const normalized = normalizeTitle(article.title);

    if (!seen.has(normalized)) {
      seen.add(normalized);
      uniqueNews.push(article);
    }
  }

  // Perform fake news analysis on all unique articles
  const fakeNewsAnalysis = analyzeFakeNewsPatterns(uniqueNews);

  console.log({
    api: apiNews.length,
    rss: rssNews.length,
    total: allNews.length,
    unique: uniqueNews.length,
    fakeAnalysis: {
      fake: fakeNewsAnalysis.fake,
      likelyFake: fakeNewsAnalysis.likelyFake,
      highlySuspicious: fakeNewsAnalysis.highlySuspicious,
      averageFakeScore: fakeNewsAnalysis.averageFakeScore.toFixed(2)
    }
  });

  return {
    articles: uniqueNews,
    fakeNewsAnalysis
  };
};

module.exports = aggregateNews;

// TEMP TEST CALL
aggregateNews( process.env.NEWS_API_KEY).then(res => {
  console.log("Sample output:", res.articles.slice(0, 2));
  console.log("Fake news analysis:", res.fakeNewsAnalysis);
});