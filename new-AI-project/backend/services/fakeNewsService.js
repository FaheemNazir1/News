// Fake News Detection Service
const clickbaitKeywords = [
  'shocking', 'unbelievable', 'incredible', 'amazing', 'miracle', 'breakthrough',
  'you won\'t believe', 'must read', 'exclusive', 'revealed', 'secret',
  'urgent', 'breaking', 'alert', 'warning', 'dangerous', 'deadly'
];

const sensationalWords = [
  'catastrophic', 'devastating', 'unprecedented', 'historic', 'massive',
  'explosive', 'total chaos', 'complete disaster', 'meltdown', 'panic',
  'crisis', 'emergency', 'outbreak', 'scandal', 'controversy'
];

const unreliableSources = [
  'theonion.com', 'dailymash.co.uk', 'clickhole.com', 'satirewire.com',
  'thehardtimes.net', 'newsbiscuit.com', 'empirenews.net'
];

const detectFakeNews = (article) => {
  // Handle undefined/null values
  const title = (article.title || '').toString();
  const content = (article.content || '').toString();
  const sentiment = article.sentiment || 'neutral';
  const score = typeof article.score === 'number' ? article.score : 0;
  
  let fakeScore = 0;
  let fakeReasons = [];
  let isFake = false;

  // Check 1: Single source detection
  const sourceCount = 1; // In real implementation, you'd count multiple articles about same topic
  if (sourceCount === 1) {
    fakeScore += 20;
    fakeReasons.push('single_source');
  }

  // Check 2: Extreme sentiment
  if (sentiment === 'positive' || sentiment === 'negative') {
    const sentimentMagnitude = Math.abs(score);
    if (sentimentMagnitude > 5) {
      fakeScore += 25;
      fakeReasons.push('extreme_sentiment');
    }
  }

  // Check 3: Clickbait keywords
  const titleLower = title.toLowerCase();
  const contentLower = content.toLowerCase();
  const foundClickbait = clickbaitKeywords.some(keyword => 
    titleLower.includes(keyword) || contentLower.includes(keyword)
  );
  
  if (foundClickbait) {
    fakeScore += 30;
    fakeReasons.push('clickbait_keywords');
  }

  // Check 4: Sensational language
  const foundSensational = sensationalWords.some(word => 
    titleLower.includes(word) || contentLower.includes(word)
  );
  
  if (foundSensational) {
    fakeScore += 25;
    fakeReasons.push('sensational_language');
  }

  // Check 5: Unreliable source
  const url = (article.url || '').toString();
  const isUnreliable = unreliableSources.some(source => 
    url.includes(source)
  );
  
  if (isUnreliable) {
    fakeScore += 40;
    fakeReasons.push('unreliable_source');
  }

  // Determine if article is fake
  isFake = fakeScore >= 40;

  // Calculate credibility score (inverse of fake score)
  const credibilityScore = Math.max(0, 100 - fakeScore);

  return {
    fakeScore,
    isFake,
    fakeReasons,
    credibilityScore
  };
};

const analyzeFakeNewsPatterns = (articles) => {
  const analysis = {
    total: articles.length,
    fake: 0,
    likelyFake: 0,
    highlySuspicious: 0,
    averageFakeScore: 0,
    fakeReasonsDistribution: {},
    sentimentDistribution: { positive: 0, negative: 0, neutral: 0 }
  };

  articles.forEach(article => {
    const detection = detectFakeNews(article);
    
    // Update article with fake news detection
    article.fakeScore = detection.fakeScore;
    article.isFake = detection.isFake;
    article.fakeReasons = detection.fakeReasons;
    article.credibilityScore = detection.credibilityScore;

    // Update analysis counters
    if (detection.isFake) {
      analysis.fake++;
    } else if (detection.fakeScore >= 30) {
      analysis.likelyFake++;
    } else if (detection.fakeScore >= 20) {
      analysis.highlySuspicious++;
    }

    analysis.averageFakeScore += detection.fakeScore;

    // Count fake reasons
    detection.fakeReasons.forEach(reason => {
      analysis.fakeReasonsDistribution[reason] = (analysis.fakeReasonsDistribution[reason] || 0) + 1;
    });

    // Count sentiment distribution
    if (article.sentiment === 'positive') analysis.sentimentDistribution.positive++;
    else if (article.sentiment === 'negative') analysis.sentimentDistribution.negative++;
    else analysis.sentimentDistribution.neutral++;
  });

  analysis.averageFakeScore = analysis.total > 0 ? analysis.averageFakeScore / analysis.total : 0;

  return analysis;
};

module.exports = {
  detectFakeNews,
  analyzeFakeNewsPatterns
};
