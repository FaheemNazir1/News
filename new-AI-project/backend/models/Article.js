const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  // Fake news detection fields
  fakeScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  isFake: {
    type: Boolean,
    default: false
  },
  fakeReasons: [{
    type: String,
    enum: ['single_source', 'extreme_sentiment', 'clickbait_keywords', 'sensational_language', 'unreliable_source']
  }],
  credibilityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  publishedAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Article', articleSchema);
