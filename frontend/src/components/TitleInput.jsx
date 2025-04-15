import React from 'react';
import { X } from 'lucide-react';

export default function TitleInput({ value, onChange, suggestions }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Plan Title</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 pr-10"
          placeholder="Enter or select a title"
        />
        {value && (
          <button
            className="absolute right-3 inset-y-0 my-auto flex items-center text-gray-500 hover:text-gray-700"
            onClick={() => onChange('')}
          >
            <X size={18} />
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {suggestions.map((title, idx) => (
          <button
            key={idx}
            onClick={() => onChange(title)}
            className={`text-sm px-3 py-1.5 border rounded-full transition ${
              value === title ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-blue-50'
            }`}
          >
            {title}
          </button>
        ))}
      </div>
    </div>
  );
}