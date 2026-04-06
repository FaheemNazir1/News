const axios = require('axios');
const { analyzeSentiment } = require('./sentimentService');
const { detectFakeNews } = require('./fakeNewsService');
const { summarizeArticle } = require('./summarizeService');

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

const extractTitle = (html) => {
  if (!html) return '';
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? stripHtml(match[1]) : '';
};

const extractMetaTitle = (html) => {
  if (!html) return '';
  const og = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i);
  if (og) return stripHtml(og[1]);
  const tw = html.match(/<meta[^>]+name=["']twitter:title["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i);
  if (tw) return stripHtml(tw[1]);
  return '';
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
    const candidate = raw
      .replace(/\u0000/g, '')
      .replace(/\n/g, ' ')
      .trim();
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

const extractContentSectionHtml = (html, hostname) => {
  if (!html) return '';
  const host = (hostname || '').toLowerCase();

  if (host.includes('bbc.')) {
    const bbcMain = html.match(/<main[^>]+id=["']main-content["'][\s\S]*?<\/main>/i);
    if (bbcMain) return bbcMain[0];
  }

  const article = html.match(/<article\b[\s\S]*?<\/article>/i);
  if (article) return article[0];

  const main = html.match(/<main\b[\s\S]*?<\/main>/i);
  if (main) return main[0];

  return html;
};

const isBoilerplateParagraph = (t) => {
  const s = (t || '').toLowerCase();
  if (!s) return true;
  if (s.includes('cookie') && (s.includes('consent') || s.includes('preferences') || s.includes('policy'))) return true;
  if (s.includes('privacy') && (s.includes('policy') || s.includes('notice'))) return true;
  if (s.includes('terms of use') || s.includes('terms and conditions')) return true;
  if (s.includes('sign up') && (s.includes('newsletter') || s.includes('email'))) return true;
  if (s.includes('subscribe') && (s.includes('newsletter') || s.includes('to continue'))) return true;
  if (s.includes('advertisement') || s.includes('sponsored')) return true;
  if (s.includes('follow us on') || s.includes('share this') || s.includes('related topics')) return true;
  if (s.includes('read more') && s.length < 120) return true;
  return false;
};

const dedupePreserveOrder = (arr) => {
  const seen = new Set();
  const out = [];
  for (const x of arr) {
    const key = (x || '').toLowerCase();
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(x);
  }
  return out;
};

const extractParagraphText = (html) => {
  if (!html) return '';
  const paras = [];
  const re = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const t = stripHtml(m[1]);
    if (!t) continue;
    if (t.length < 40) continue;
    if (isBoilerplateParagraph(t)) continue;
    paras.push(t);
  }

  const cleaned = dedupePreserveOrder(paras);
  if (cleaned.length >= 2) return cleaned.join('\n');

  const fallbackText = stripHtml(html);
  if (!fallbackText) return '';
  const lines = fallbackText
    .split(/\n+/)
    .map((x) => x.trim())
    .filter((x) => x.length >= 60)
    .filter((x) => !isBoilerplateParagraph(x));
  return dedupePreserveOrder(lines).slice(0, 60).join('\n');
};

const safeHostnameFromUrl = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
};

const sourceNameFromHostname = (hostname) => {
  const h = (hostname || '').toLowerCase();
  if (!h) return '';
  if (h.includes('bbc.')) return 'BBC';
  if (h.includes('reuters.')) return 'Reuters';
  if (h.includes('nytimes.')) return 'The New York Times';
  if (h.includes('aljazeera.')) return 'Al Jazeera';

  const parts = h.split('.').filter(Boolean);
  const core = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
  if (!core) return hostname;
  return core.charAt(0).toUpperCase() + core.slice(1);
};

const limitWords = (text, maxWords = 2000) => {
  const words = (text || '').toString().replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  if (words.length <= maxWords) return words.join(' ');
  return words.slice(0, maxWords).join(' ');
};

const buildPrompt = (content) => {
  return `You are an AI news analysis assistant.

Analyze the given news article and provide a complete report.

Return strictly in this format:

Source: (news channel or website name)
Title: (short title)
Summary:

* 3–4 bullet points covering key facts

Sentiment: (Positive / Negative / Neutral)

Verdict: (Real / Fake / Misleading / Uncertain)
Confidence: (0–100%)

Reason:

* 2–4 bullet points explaining the verdict

Rules:

* Use simple and factual language
* Do not add new information
* Be objective and analytical

Article:
${content}`;
};

const tryParseJson = (text) => {
  if (!text) return null;
  const raw = text.toString().trim();
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
};

const llmAnalyze = async ({ content, source }) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const prompt = buildPrompt(content);

  const resp = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model,
      messages: [
        {
          role: 'system',
          content:
            'Return ONLY valid JSON with keys: source (string), title (string), summary (array of strings), sentiment (string), verdict (string), confidence (string or number), reason (array of strings).'
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

  const out = resp?.data?.choices?.[0]?.message?.content;
  const parsed = tryParseJson(out);
  if (!parsed) return null;

  if (typeof parsed.source !== 'string' && source) parsed.source = source;

  return parsed;
};

const normalizeOutput = (obj, fallback) => {
  const source = typeof obj?.source === 'string' ? obj.source.trim() : fallback.source;
  const title = typeof obj?.title === 'string' ? obj.title.trim() : fallback.title;
  const summary = Array.isArray(obj?.summary) ? obj.summary.filter((x) => typeof x === 'string').map((x) => x.trim()).filter(Boolean) : fallback.summary;
  const sentiment = typeof obj?.sentiment === 'string' ? obj.sentiment.trim() : fallback.sentiment;
  const verdict = typeof obj?.verdict === 'string' ? obj.verdict.trim() : fallback.verdict;
  const confidence = obj?.confidence;
  const confidenceStr = typeof confidence === 'number' ? `${Math.round(confidence)}%` : typeof confidence === 'string' ? confidence.trim() : fallback.confidence;
  const reason = Array.isArray(obj?.reason) ? obj.reason.filter((x) => typeof x === 'string').map((x) => x.trim()).filter(Boolean) : fallback.reason;

  return {
    source,
    title,
    summary: summary.slice(0, 4),
    sentiment,
    verdict,
    confidence: confidenceStr,
    reason: reason.slice(0, 4)
  };
};

const fallbackAnalyze = async ({ source, title, content }) => {
  const sentimentRes = analyzeSentiment(content);

  const fake = detectFakeNews({
    title: title || '',
    content,
    sentiment: sentimentRes.sentiment,
    score: sentimentRes.score
  });

  const summarized = await summarizeArticle(content);

  const verdict = fake.isFake
    ? 'Fake'
    : fake.fakeScore >= 35
      ? 'Misleading'
      : fake.fakeScore >= 25
        ? 'Uncertain'
        : 'Real';

  const confidence = `${Math.max(0, Math.min(100, Math.round(fake.credibilityScore)))}%`;

  const reason = Array.isArray(fake.fakeReasons) && fake.fakeReasons.length
    ? fake.fakeReasons.slice(0, 4).map((r) => r.toString())
    : ['insufficient_signals'];

  return {
    source,
    title: title || summarized.title || '',
    summary: summarized.summary || [],
    sentiment: sentimentRes.sentiment ? sentimentRes.sentiment.charAt(0).toUpperCase() + sentimentRes.sentiment.slice(1) : 'Neutral',
    verdict,
    confidence,
    reason
  };
};

const analyzeUrl = async (url) => {
  const hostname = safeHostnameFromUrl(url);
  const source = sourceNameFromHostname(hostname);

  const response = await axios.get(url, {
    timeout: 12000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });

  const html = response.data;
  const extractedTitle = extractMetaTitle(html) || extractTitle(html);
  const jsonLdBody = extractJsonLdArticleBody(html);
  const sectionHtml = extractContentSectionHtml(html, hostname);
  const mainText = jsonLdBody || extractParagraphText(sectionHtml);

  const metaDesc = extractMetaDescription(html);
  const combined = metaDesc && mainText && !mainText.toLowerCase().includes(metaDesc.toLowerCase())
    ? `${metaDesc}\n${mainText}`
    : (mainText || metaDesc);

  const limited = limitWords(combined, 2000);

  const content = limited;
  if (!content || content.length < 80) {
    return {
      error: 'No content extracted'
    };
  }

  const fallback = await fallbackAnalyze({ source, title: extractedTitle, content });
  const llm = await llmAnalyze({ content, source }).catch(() => null);

  if (llm) {
    return normalizeOutput(llm, fallback);
  }

  return fallback;
};

module.exports = {
  analyzeUrl
};
