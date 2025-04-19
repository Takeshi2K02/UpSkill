import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CommonLayout from '../layouts/CommonLayout';
import { getLearningPlanById, updateTopicStatus } from '../services/learningPlanService';

export default function LearningPlanDetail() {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await getLearningPlanById(id);
        setPlan(data);
      } catch (error) {
        console.error('Failed to load plan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  return (
    <CommonLayout>
      <div className="p-6 bg-white min-h-screen">
        {loading ? (
          <p className="text-center text-gray-500">Loading learning plan...</p>
        ) : plan ? (
          <>
            <h2 className="text-2xl font-bold text-blue-700 mb-6">{plan.title}</h2>
            <p className="text-gray-700 mb-4">{plan.description}</p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Topics</h3>
            <div className="space-y-4">
              {plan.topics && plan.topics.length > 0 ? (
                plan.topics.map((topic, idx) => (
                  <div key={idx} className="bg-gray-100 p-4 rounded flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={topic.status === 'completed'}
                      onChange={async () => {
                        const newStatus = topic.status === 'completed' ? 'incomplete' : 'completed';
                        
                        // Update local plan state for immediate UI feedback
                        setPlan(prevPlan => {
                          const updatedTopics = prevPlan.topics.map((t, i) => {
                            if (i === idx) {
                              return { ...t, status: newStatus };
                            }
                            return t;
                          });
                          return { ...prevPlan, topics: updatedTopics };
                        });

                        try {
                          await updateTopicStatus(id, idx, newStatus);
                        } catch (error) {
                          console.error('Failed to update topic status:', error);
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">{topic.name}</h4>
                      <p className="text-sm text-gray-600 mt-2">{topic.textContent}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No topics available.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-red-500">Learning Plan not found.</p>
        )}
      </div>
    </CommonLayout>
  );
}