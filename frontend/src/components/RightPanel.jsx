// src/components/RightPanel.jsx
import React from 'react';

const users = [
  'Ayesh J.',
  'Sanduni M.',
  'Chamod R.',
  'Dilshan B.',
  'Hasini D.',
  'Kavindu P.',
  'Shanali K.',
  'Pasindu W.',
  'Malsha S.',
  'Kalana D.',
];

export default function RightPanel() {
  return (
    <aside className="w-72 hidden xl:flex flex-col space-y-4 p-4">
      {/* Progress Summary */}
      <div className="bg-white rounded-lg shadow">
        <h3 className="text-sm font-semibold text-gray-700 px-4 pt-4 pb-2">Progress</h3>
        <div className="p-4 pt-0">
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
      </div>

      {/* Community Groups */}
      <div className="bg-white rounded-lg shadow">
        <h3 className="text-sm font-semibold text-gray-700 px-4 pt-4 pb-2">Groups</h3>
        <div className="p-4 pt-0">
          <ul className="space-y-2 text-blue-700 text-sm font-medium">
            <li>#ReactDevs</li>
            <li>#Foodies</li>
            <li>#PhotographyPro</li>
          </ul>
        </div>
      </div>

      {/* Suggested Users – scrollable with clean sticky heading */}
      <div className="bg-white rounded-lg shadow max-h-64 overflow-hidden relative flex flex-col pb-4">
        {/* Sticky Title */}
        <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-2">
          <h3 className="text-sm font-semibold text-gray-700">Suggestions</h3>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 px-4 pt-0 overflow-y-auto hover:overflow-y-auto">
          <ul className="space-y-2 text-sm">
            {users.map((u, idx) => (
              <li key={idx} className="text-gray-800">👤 {u}</li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
