import React from 'react';

export default function CompletedPlanCard({ plan }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold text-gray-800">{plan.title}</h3>
      {/* View-only summary will go here */}
    </div>
  );
}