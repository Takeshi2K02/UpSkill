import { useState } from 'react';
import { generateGeminiContent } from './geminiService';

export default function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [response, setResponse] = useState('');

  const askGemini = async (prompt) => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const result = await generateGeminiContent(prompt);
      setResponse(result);
      return result;
    } catch (err) {
      setError('Failed to generate AI response.');
      console.error('[useAI Error]', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    response,
    askGemini
  };
}