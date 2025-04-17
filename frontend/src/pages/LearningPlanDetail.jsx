import React from 'react';
import { useParams } from 'react-router-dom';
import CommonLayout from '../layouts/CommonLayout';

export default function LearningPlanDetail() {
  const { id } = useParams(); // extract id from URL

  return (
    <CommonLayout>
      <div className="p-6 bg-white min-h-screen">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Learning Plan Details</h2>

        <div className="bg-gray-100 p-4 rounded">
          <p className="text-gray-700 mb-2"><span className="font-semibold">Learning Plan ID:</span> {id}</p>
          {/* Later we will fetch and show the full plan */}
        </div>
      </div>
    </CommonLayout>
  );
}