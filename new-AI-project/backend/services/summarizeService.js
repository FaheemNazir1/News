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

const stripHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
};

const extractMetaDescription = (html) => {
  if (!html) return '';
  const og = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i);
  if (og) return stripHtml(og[1]);
  const desc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i);
  if (desc) return stripHtml(desc[1]);
  return '';
};

const extractJsonLdArticleBody = (html) => {
  if (!html) return '';
  const scripts = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = (m[1] || '').trim();
    if (raw) scripts.push(raw);
  }
  for (const raw of scripts) {
    const candidate = raw.replace(/\u0000/g, '').replace(/\n/g, ' ').trim();
    try {
      const parsed = JSON.parse(candidate);
      const stack = Array.isArray(parsed) ? parsed : [parsed];
      for (const obj of stack) {
        if (!obj) continue;
        const body = obj.articleBody || obj?.mainEntityOfPage?.articleBody;
        if (typeof body === 'string' && body.trim().length > 200) {
          return body.trim();
        }
      }
    } catch {
      continue;
    }
  }
  return '';
};

const extractContentSectionHtml = (html) => {
  if (!html) return '';
  const article = html.match(/<article\b[\s\S]*?<\/article>/i);
  if (article) return article[0];
  const main = html.match(/<main\b[\s\S]*?<\/main>/i);
  if (main) return main[0];
  return html;
};

const extractParagraphText = (html) => {
  if (!html) return '';
  const paras = [];
  const re = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const t = stripHtml(m[1]);
    if (t && t.length > 40) paras.push(t);
  }
  return paras.length ? paras.join('\n') : stripHtml(html);
};

const limitWords = (text, maxWords = 1800) => {
  const words = (text || '').toString().replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  if (words.length <= maxWords) return words.join(' ');
  return words.slice(0, maxWords).join(' ');
};

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

const summarizeUrl = async (url) => {
  const resp = await axios.get(url, {
    timeout: 15000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });

  const html = resp?.data;
  const jsonLdBody = extractJsonLdArticleBody(html);
  const sectionHtml = extractContentSectionHtml(html);
  const mainText = jsonLdBody || extractParagraphText(sectionHtml);
  const metaDesc = extractMetaDescription(html);

  const combined = metaDesc && mainText && !mainText.toLowerCase().includes(metaDesc.toLowerCase())
    ? `${metaDesc}\n${mainText}`
    : (mainText || metaDesc);

  const content = limitWords(combined, 1800);
  if (!content || content.length < 80) {
    return fallbackSummarize(metaDesc || '');
  }

  return summarizeArticle(content);
};

module.exports = {
  summarizeArticle,
  summarizeUrl
};
