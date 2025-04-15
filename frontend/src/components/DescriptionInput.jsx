import React from 'react';

export default function DescriptionInput() {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          className="w-full border border-gray-300 rounded px-3 py-2"
          rows="3"
          placeholder="Write a short description..."
        />
      </div>
    );
  }