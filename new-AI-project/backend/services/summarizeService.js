const axios = require('axios');

const cleanText = (text) => (text || '').toString().replace(/\s+/g, ' ').trim();

const splitSentences = (text) => {
  const t = cleanText(text);
  if (!t) return [];
  const parts = t
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : [t];
};

const clampList = (arr, n) => arr.slice(0, n);

const fallbackSummarize = (article) => {
  const text = cleanText(article);
  const sentences = splitSentences(text);

  const titleSource = sentences[0] || text;
  const title = cleanText(titleSource).slice(0, 90);

  const summary = clampList(sentences, 4).map((s) => {
    if (s.length <= 220) return s;
    return s.slice(0, 219).trimEnd() + '…';
  });

  return {
    title: title || 'Summary',
    summary
  };
};

const buildPrompt = (article) => {
  return `You are an AI news summarization assistant.

Summarize the given news article.

Instructions:

* Generate a short and relevant title
* Provide 3–4 bullet points covering key facts (who, what, when, where, why)

Rules:

* Use simple and clear language
* Do not add new information
* Do not include opinions
* Keep it factual and objective

Article:
${article}`;
};

const tryParseJson = (text) => {
  if (!text) return null;
  const raw = text.toString().trim();

  const direct = (() => {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  })();
  if (direct) return direct;

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
};

const normalizeOutput = (obj, fallback) => {
  const title = typeof obj?.title === 'string' ? obj.title.trim() : fallback.title;
  const summary = Array.isArray(obj?.summary) ? obj.summary.filter((x) => typeof x === 'string').map((x) => x.trim()).filter(Boolean) : fallback.summary;

  return {
    title: title || fallback.title,
    summary: summary.slice(0, 4)
  };
};

const summarizeWithOpenAI = async (article) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const prompt = buildPrompt(article);

  const resp = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model,
      messages: [
        {
          role: 'system',
          content: 'Return ONLY valid JSON with keys: title (string), summary (array of strings).'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 20000
    }
  );

  const content = resp?.data?.choices?.[0]?.message?.content;
  const parsed = tryParseJson(content);
  if (!parsed) {
    console.error('OpenAI summarize: failed to parse JSON response');
  }
  return parsed;
};

const summarizeArticle = async (article) => {
  const safe = cleanText(article);
  const fallback = fallbackSummarize(safe);

  const llmJson = await summarizeWithOpenAI(safe).catch((error) => {
    console.error('OpenAI summarize error:', error?.response?.data || error?.message || error);
    return null;
  });
  if (llmJson) {
    return normalizeOutput(llmJson, fallback);
  }

  return fallback;
};

module.exports = {
  summarizeArticle
};
