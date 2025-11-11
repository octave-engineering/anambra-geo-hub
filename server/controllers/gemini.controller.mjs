/**
 * Gemini AI Controller
 * Handles Gemini API interactions
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/app.config.mjs';

// Initialize Gemini AI
const genAI = config.gemini.apiKey 
  ? new GoogleGenerativeAI(config.gemini.apiKey, { apiVersion: config.gemini.apiVersion })
  : null;

if (!config.gemini.apiKey) {
  console.warn('Warning: GEMINI_API_KEY not set. Gemini features will be disabled.');
}

/**
 * Health check endpoint
 */
export const healthCheck = (req, res) => {
  res.json({ 
    ok: true, 
    model: config.gemini.defaultModel, 
    hasKey: Boolean(config.gemini.apiKey), 
    apiVersion: config.gemini.apiVersion 
  });
};

/**
 * Generate content using Gemini
 */
export const generateContent = async (req, res, next) => {
  try {
    const { prompt, model, parts } = req.body || {};

    if (!genAI) {
      return res.status(500).json({ error: 'Server not configured with GEMINI_API_KEY' });
    }

    const modelId = model || config.gemini.defaultModel;
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
  } catch (error) {
    next(error);
  }
};
