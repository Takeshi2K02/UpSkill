// src/components/RightPanel.jsx
import React from 'react';

export default function RightPanel() {
  return (
    <aside className="w-72 hidden xl:block p-4 space-y-6">
      {/* Progress Summary */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">Progress</h3>
        <ul className="space-y-3 text-sm">
          <li>
            <span className="block font-medium">Python Basics</span>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }} />
            </div>
          </li>
          <li>
            <span className="block font-medium">React Fundamentals</span>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }} />
            </div>
          </li>
        </ul>
      </div>

      {/* Community Groups */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Groups</h3>
        <ul className="space-y-2 text-blue-700 text-sm font-medium">
          <li>#ReactDevs</li>
          <li>#Foodies</li>
          <li>#PhotographyPro</li>
        </ul>
      </div>

      {/* Suggested Users */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Suggestions</h3>
        <ul className="space-y-2 text-sm">
          <li className="text-gray-800">👤 Ayesh J.</li>
          <li className="text-gray-800">👤 Sanduni M.</li>
          <li className="text-gray-800">👤 Chamod R.</li>
        </ul>
      </div>
    </aside>
  );
}