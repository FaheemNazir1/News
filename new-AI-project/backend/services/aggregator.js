const fetchNewsAPI = require('./sources/newsApi');
const fetchWorldNewsAPI = require('./sources/worldNewsApi');
const fetchRSS = require('./sources/rssSource');
const { analyzeFakeNewsPatterns } = require('./fakeNewsService');

const safeHostnameFromUrl = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
};

const getCredibilityLevel = (article) => {
  const hostname = safeHostnameFromUrl(article?.url || '').toLowerCase();
  const source = (article?.source || '').toString().toLowerCase();

  const trusted = [
    'bbc.',
    'reuters.',
    'apnews.',
    'theguardian.',
    'nytimes.',
    'aljazeera.',
    'washingtonpost.',
    'wsj.',
    'bloomberg.',
    'ft.com',
    'economist.'
  ];

  const isTrusted = trusted.some((t) => hostname.includes(t)) || ['bbc', 'reuters', 'associated press', 'ap', 'the new york times', 'al jazeera'].some((s) => source.includes(s));
  if (isTrusted) return 'Trusted';

  const medium = ['indiatimes', 'timesofindia', 'ndtv', 'dawn', 'geo', 'arynews', 'thehindu', 'hindustantimes', 'tribune', 'cnn', 'cnbc', 'fox', 'nbc', 'abcnews'];
  const isMedium = medium.some((m) => hostname.includes(m)) || medium.some((m) => source.includes(m));
  if (isMedium) return 'Medium';

  return 'Unknown';
};

const buildVerdict = (fakeScore, isFake) => {
  if (isFake) return 'Fake';
  if (fakeScore >= 35) return 'Misleading';
  if (fakeScore >= 25) return 'Uncertain';
  return 'Real';
};

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

  const standardized = uniqueNews.map((a) => {
    const fakeScore = typeof a.fakeScore === 'number' ? a.fakeScore : 0;
    const credibilityScore = typeof a.credibilityScore === 'number' ? a.credibilityScore : Math.max(0, 100 - fakeScore);
    const trustScore = Math.max(0, Math.min(100, Math.round(credibilityScore)));
    const reasons = Array.isArray(a.fakeReasons) ? a.fakeReasons : [];
    const verdict = buildVerdict(fakeScore, !!a.isFake);
    const confidence = `${trustScore}%`;
    const credibilityLevel = getCredibilityLevel(a);
    const publishDate = a.publishedAt ? new Date(a.publishedAt).toISOString() : '';
    const author = a.author || '';

    return {
      ...a,
      trustScore,
      verdict,
      confidence,
      reasons,
      credibilityLevel,
      publishDate,
      author
    };
  });

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
    articles: standardized,
    fakeNewsAnalysis
  };
};

module.exports = aggregateNews;