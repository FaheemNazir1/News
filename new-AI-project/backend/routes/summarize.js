const express = require('express');
const router = express.Router();
const { summarizeArticle, summarizeUrl } = require('../services/summarizeService');

router.post('/', async (req, res) => {
  try {
    const url = typeof req.body?.url === 'string' ? req.body.url.trim() : '';
    const article = typeof req.body?.article === 'string' ? req.body.article : '';

    if (url) {
      if (!/^https?:\/\//i.test(url)) {
        return res.status(400).json({ error: 'Invalid URL' });
      }
      const result = await summarizeUrl(url);
      return res.json(result);
    }

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
