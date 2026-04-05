const Sentiment = require('sentiment');

const sentiment = new Sentiment();

const analyzeSentiment = (text) => {
  const result = sentiment.analyze(text);
  
  let sentimentLabel = 'neutral';
  if (result.score > 0) {
    sentimentLabel = 'positive';
  } else if (result.score < 0) {
    sentimentLabel = 'negative';
  }
  
  return {
    sentiment: sentimentLabel,
    score: result.score
  };
};

module.exports = { analyzeSentiment };
