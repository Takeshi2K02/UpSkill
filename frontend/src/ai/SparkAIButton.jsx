import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import useAI from './useAI';

export default function SparkAIButton({ prompt, onResult, className = '', iconSize = 18, title = 'Generate with AI' }) {
  const { loading, response, askGemini } = useAI();

  const handleClick = async () => {
    const result = await askGemini(prompt);
    if (result) {
      onResult(result);
    }
  };
  

  return (
    <button
      type="button"
      className={`absolute top-3 right-3 text-blue-600 hover:text-blue-800 ${className}`}
      onClick={handleClick}
      title={title}
      disabled={loading}
    >
      {loading ? <Loader2 size={iconSize} className="animate-spin" /> : <Sparkles size={iconSize} />}
    </button>
  );
}