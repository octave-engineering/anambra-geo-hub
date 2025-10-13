import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const apiVersion = (process.env.GEMINI_API_VERSION || 'v1').toLowerCase();
if (!apiKey) {
  console.warn('Warning: GEMINI_API_KEY not set. Set it in .env');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey, { apiVersion }) : null;

// Pick a reasonable default model; allow override via env or request body
const DEFAULT_MODEL = process.env.GEMINI_MODEL || process.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash-001';

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, model: DEFAULT_MODEL, hasKey: Boolean(apiKey), apiVersion });
});

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, model, parts } = req.body || {};

    if (!genAI) {
      return res.status(500).json({ error: 'Server not configured with GEMINI_API_KEY' });
    }

    const modelId = model || DEFAULT_MODEL;
    const gm = genAI.getGenerativeModel({ model: modelId });

    // Support either a simple text prompt or multimodal parts array
    let result;
    if (Array.isArray(parts) && parts.length > 0) {
      result = await gm.generateContent(parts);
    } else if (typeof prompt === 'string' && prompt.trim()) {
      result = await gm.generateContent(prompt);
    } else {
      return res.status(400).json({ error: 'Provide a text prompt or a parts array.' });
    }

    const text = result?.response?.text?.() || '';
    res.json({ text, model: modelId });
  } catch (err) {
    console.error('Gemini server error:', err);
    const message = err?.response?.data || err?.message || 'Unknown error';
    res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`Gemini server listening on http://localhost:${PORT}`);
});
