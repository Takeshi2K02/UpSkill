// src/pages/LearningPlans.jsx
import React from 'react';
import CommonLayout from '../layouts/CommonLayout';

export default function LearningPlans() {
  return (
    <CommonLayout>
      <div className="bg-white p-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">My Learning Plans</h2>
        <p className="text-gray-600">This is where your structured learning plans will appear.</p>
        {/* Later you'll add list of plans, add button, etc. */}
      </div>
    </CommonLayout>
  );
}
