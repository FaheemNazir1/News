const express = require('express');
const router = express.Router();
const { analyzeUrl } = require('../services/analyzeUrlService');

router.post('/', async (req, res) => {
  try {
    const url = typeof req.body?.url === 'string' ? req.body.url.trim() : '';

    if (!url) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    if (!/^https?:\/\//i.test(url)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const result = await analyzeUrl(url);

    if (result && result.error) {
      return res.status(422).json({ error: result.error });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

module.exports = router;
