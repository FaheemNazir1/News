const fetchNewsAPI = require('./sources/newsApi');
const fetchWorldNewsAPI = require('./sources/worldNewsApi');
const fetchRSS = require('./sources/rssSource');
const { analyzeFakeNewsPatterns } = require('./fakeNewsService');

const normalizeTitle = (title) =>
  title?.toLowerCase().replace(/[^\w\s]/gi, '').trim();

const matchesKeyword = (article, keyword) => {
  const k = (keyword || '').toString().trim().toLowerCase();
  if (!k) return true;
  const hay = `${article?.title || ''} ${article?.content || ''} ${article?.source || ''}`.toLowerCase();
  return hay.includes(k);
};

const aggregateNews = async (newsApiKey, worldNewsApiKey, keyword = '') => {
  const [apiNews, worldNews, rssNews] = await Promise.all([
    newsApiKey ? fetchNewsAPI(newsApiKey, keyword) : Promise.resolve([]),
    worldNewsApiKey ? fetchWorldNewsAPI(worldNewsApiKey, keyword) : Promise.resolve([]),
    fetchRSS()
  ]);

  const allNews = [...apiNews, ...worldNews, ...rssNews].filter((a) => matchesKeyword(a, keyword));

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
    world: worldNews.length,
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