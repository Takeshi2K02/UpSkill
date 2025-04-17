import React, { useEffect, useState } from 'react';
import { getLearningPlansByUser } from '../services/learningPlanService';
import { FiPlus } from 'react-icons/fi';
import CommonLayout from '../layouts/CommonLayout';
import { Link } from 'react-router-dom';

export default function LearningPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const pendingPlans = plans.filter(plan => !plan.dueDate);
  const currentPlans = plans.filter(plan => {
    if (!plan.dueDate) return false;
    const totalTopics = plan.topics?.length || 0;
    const completedTopics = plan.topics?.filter(t => t.status === 'COMPLETED').length || 0;
    return completedTopics < totalTopics;
  });
  const completedPlans = plans.filter(plan => {
    const totalTopics = plan.topics?.length || 0;
    const completedTopics = plan.topics?.filter(t => t.status === 'COMPLETED').length || 0;
    return totalTopics > 0 && completedTopics === totalTopics;
  });

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const userId = sessionStorage.getItem('facebookId');
        if (!userId) {
          console.error('No user ID found');
          return;
        }
        const data = await getLearningPlansByUser(userId);
        setPlans(data);
      } catch (error) {
        console.error('Failed to fetch learning plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const renderPlanCard = (plan) => {
    const planId = plan._id?.$oid || plan.id; // fallback safely

    if (!planId) return null; // safety check

    return (
      <Link to={`/learning-plans/${planId}`} key={planId}>
        <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{plan.title}</h3>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded mb-2">
            {/* Progress bar will be added later */}
          </div>
          <p className="text-sm text-gray-600">
            Due: {plan.dueDate ? new Date(plan.dueDate).toLocaleDateString() : 'No due date'}
          </p>
        </div>
      </Link>
    );
  };


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

        {loading ? (
          <p className="text-center text-gray-500">Loading learning plans...</p>
        ) : (
          <div className="space-y-10">
            {pendingPlans.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Pending Plans</h3>
                <div className="space-y-4">
                  {pendingPlans.map(renderPlanCard)}
                </div>
              </div>
            )}

            {currentPlans.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Plans</h3>
                <div className="space-y-4">
                  {currentPlans.map(renderPlanCard)}
                </div>
              </div>
            )}

            {completedPlans.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Completed Plans</h3>
                <div className="space-y-4">
                  {completedPlans.map(renderPlanCard)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </CommonLayout>
  );
}