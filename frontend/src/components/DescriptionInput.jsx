import React from 'react';
import { Sparkles } from 'lucide-react';

export default function DescriptionInput() {
  return (
    <div className="mb-6 relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>

      <div className="relative">
        <textarea
          className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none shadow-sm"
          rows="4"
          placeholder="Write a short description for your learning plan..."
        />

        <button
          className="absolute top-3 right-3 text-blue-600 hover:text-blue-800"
          title="Generate with AI"
          onClick={() => console.log('Generate description with AI')}
        >
          <Sparkles size={18} />
        </button>
      </div>
    </div>
  );
}