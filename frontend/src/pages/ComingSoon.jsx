import React from 'react';
import CommonLayout from '../layouts/CommonLayout'; // ✨ Import CommonLayout

export default function ComingSoon() {
  return (
    <CommonLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white text-gray-700 p-6 rounded-lg shadow">
        <h1 className="text-4xl font-bold mb-4">🚀 Coming Soon</h1>
        <p className="text-lg text-center">This feature is under development. Stay tuned!</p>
      </div>
    </CommonLayout>
  );
}