const express = require('express');
const router = express.Router();
const { summarizeArticle } = require('../services/summarizeService');

router.post('/', async (req, res) => {
  try {
    const article = typeof req.body?.article === 'string' ? req.body.article : '';
    if (!article || !article.trim()) {
      return res.status(400).json({ error: 'Missing article' });
    }

    const result = await summarizeArticle(article);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Summarization failed' });
  }
});

module.exports = router;
