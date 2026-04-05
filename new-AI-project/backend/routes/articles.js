const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const aggregateNews = require("../services/aggregator");
const { analyzeFakeNewsPatterns } = require("../services/fakeNewsService");


// 📰 GET ALL ARTICLES (with filters + pagination)
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sentiment,
      search,
      source,
      sortBy = "publishedAt"
    } = req.query;

    const query = {};

    // ✅ sentiment filter
    if (sentiment && sentiment !== "all") {
      query.sentiment = sentiment;
    }

    // ✅ source filter
    if (source) {
      query.source = source;
    }

    // ✅ search (title + content)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }

    const articles = await Article.find(query)
      .sort({ [sortBy]: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const total = await Article.countDocuments(query);

    res.json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🔥 FETCH + STORE MULTI-SOURCE ARTICLES
router.post("/fetch", async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ error: "Missing News API key" });
    }

    // 👉 multi-source aggregation
    const newsData = await aggregateNews(apiKey);
    const newsArticles = newsData.articles; // Extract just the articles array

    // 👉 bulk insert (fast + skips duplicates)
    const savedArticles = await Article.insertMany(newsArticles, {
      ordered: false
    });

    res.status(201).json({
      message: `Fetched & stored ${savedArticles.length} articles`,
      count: savedArticles.length
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ⚡ LIVE FETCH (without saving)
router.get("/live", async (req, res) => {
  try {
    const news = await aggregateNews(process.env.NEWS_API_KEY);
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 📊 SENTIMENT STATS
router.get("/sentiment/stats", async (req, res) => {
  try {
    const stats = await Article.aggregate([
      {
        $group: {
          _id: "$sentiment",
          count: { $sum: 1 },
          avgScore: { $avg: "$score" }
        }
      }
    ]);

    const total = await Article.countDocuments();

    const result = {
      total,
      distribution: {},
      averageScores: {}
    };

    stats.forEach(stat => {
      result.distribution[stat._id] = stat.count;
      result.averageScores[stat._id] = stat.avgScore;
    });

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// � FAKE NEWS STATS
router.get("/fake/stats", async (req, res) => {
  try {
    const articles = await Article.find();
    const fakeNewsAnalysis = analyzeFakeNewsPatterns(articles);
    
    res.json(fakeNewsAnalysis);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🚨 FAKE NEWS ARTICLES
router.get("/fake", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      fakeLevel = "all" // all, fake, likely_fake, suspicious
    } = req.query;

    let query = {};

    switch (fakeLevel) {
      case "fake":
        query.isFake = true;
        break;
      case "likely_fake":
        query.fakeScore = { $gte: 30, $lt: 40 };
        break;
      case "suspicious":
        query.fakeScore = { $gte: 20, $lt: 30 };
        break;
      default:
        // all articles
        break;
    }

    const articles = await Article.find(query)
      .sort({ fakeScore: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const total = await Article.countDocuments(query);

    res.json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ��️ DELETE ALL (for testing)
router.delete("/", async (req, res) => {
  try {
    await Article.deleteMany();
    res.json({ message: "All articles deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;