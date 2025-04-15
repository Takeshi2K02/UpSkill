// src/pages/LearningPlans.jsx
import React from 'react';
import { FiPlus } from 'react-icons/fi';
import CommonLayout from '../layouts/CommonLayout';
import { Link } from 'react-router-dom';

export default function LearningPlans() {
  const plans = [
    {
      title: 'Python Basics',
      progress: 70,
      dueDate: 'May 30',
      color: 'bg-blue-500',
    },
    {
      title: 'React Fundamentals',
      progress: 40,
      dueDate: 'May 30',
      color: 'bg-green-500',
    },
    {
      title: 'React Fundamentals',
      progress: 40,
      dueDate: 'May 30',
      color: 'bg-green-500',
    },
    {
      title: 'React Fundamentals',
      progress: 40,
      dueDate: 'May 30',
      color: 'bg-green-500',
    },
    {
      title: 'React Fundamentals',
      progress: 40,
      dueDate: 'May 30',
      color: 'bg-green-500',
    },
    {
      title: 'React Fundamentals',
      progress: 40,
      dueDate: 'May 30',
      color: 'bg-green-500',
    },
  ];

  return (
    <CommonLayout>
      <div className="bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-700">My Learning Plans</h2>
          <Link to="/learning-plans/create">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md shadow transition duration-200">
              <FiPlus className="text-lg" />
              Create Learning Plan
            </button>
          </Link>
        </div>

        <div className="space-y-6">
          {plans.map((plan, idx) => (
            <div key={idx} className="bg-white p-4 rounded shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{plan.title}</h3>
                <span className="text-gray-700 font-semibold">{plan.progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded mb-2">
                <div
                  className={`${plan.color} h-full rounded`}
                  style={{ width: `${plan.progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">Due: {plan.dueDate}</p>
            </div>
          ))}
        </div>
      </div>
    </CommonLayout>
  );
}