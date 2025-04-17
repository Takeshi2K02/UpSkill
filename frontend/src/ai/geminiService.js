// src/ai/geminiService.js
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function generateGeminiContent(prompt) {
  try {
    const res = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    const data = await res.json();

    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return output || '⚠️ No response generated.';
  } catch (error) {
    console.error('[Gemini Error]', error);
    return '⚠️ Failed to generate AI content.';
  }
}