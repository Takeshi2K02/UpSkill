// src/components/DescriptionInput.jsx
import React, { useRef } from 'react';
import SparkAIButton from '../ai/SparkAIButton';
import { generateDescriptionPrompt } from '../ai/prompts';

export default function DescriptionInput({ value, onChange, title = '' }) {
  const hasTitle = title.trim() !== '';
  const textareaRef = useRef(null);

  const handleInput = (e) => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
    onChange(e.target.value);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>

      <div className="relative">
        <textarea
          ref={textareaRef}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none shadow-sm overflow-hidden min-h-[42px]"
          rows={1}
          placeholder="Write a short description for your learning plan..."
          value={value}
          onChange={handleInput}
          onInput={handleInput}
        />

        {hasTitle && (
          <div className="absolute right-2 inset-y-0 my-auto">
            <SparkAIButton
              prompt={generateDescriptionPrompt(title)}
              onResult={(result) => {
                const cleaned = result.trimEnd(); // remove trailing newline
                onChange(cleaned);
                setTimeout(() => {
                  if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                    textareaRef.current.focus();
                    const length = cleaned.length;
                    textareaRef.current.setSelectionRange(length, length);
                  }
                }, 0);
              }}                            
            />
          </div>
        )}
      </div>
    </div>
  );
}