import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
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

  const calculateProgress = (plan) => {
    if (!plan || !plan.topics || plan.topics.length === 0) return 0;
    let totalWeight = 0;
    let completedWeight = 0;
    for (const topic of plan.topics) {
      const weight = topic.weight || 0;
      totalWeight += weight;
      if (topic.status === 'completed') {
        completedWeight += weight;
      }
    }
    if (totalWeight === 0) return 0;
    return Math.round((completedWeight / totalWeight) * 100);
  };

  return (
    <CommonLayout>
      <div className="p-6 bg-white min-h-screen">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
          </div>
        ) : plan ? (
          <>
            <h2 className="text-2xl font-bold text-blue-700 mb-6">{plan.title}</h2>

            {/* Progress Bar */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">Progress: {calculateProgress(plan)}%</p>
              <div className="w-full h-2 bg-gray-200 rounded mt-2">
                <div
                  className="h-full bg-blue-500 rounded"
                  style={{ width: `${calculateProgress(plan)}%` }}
                />
              </div>
            </div>

            <p className="text-gray-700 mb-4">{plan.description}</p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Topics</h3>
            <div className="space-y-6">
              {plan.topics && plan.topics.length > 0 ? (
                plan.topics.map((topic, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-gray-200">
                    {/* Title and Checkbox */}
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-800">{topic.name}</h4>
                      <input
                        type="checkbox"
                        checked={topic.status === 'completed'}
                        onChange={async () => {
                          const newStatus = topic.status === 'completed' ? 'incomplete' : 'completed';
                          setPlan(prevPlan => {
                            const updatedTopics = prevPlan.topics.map((t, i) =>
                              i === idx ? { ...t, status: newStatus } : t
                            );
                            return { ...prevPlan, topics: updatedTopics };
                          });
                          try {
                            await updateTopicStatus(id, idx, newStatus);
                          } catch (error) {
                            console.error('Failed to update topic status:', error);
                          }
                        }}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    {/* Text Content Sub-Card */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-700 mb-2">Text Content</h5>
                      <div className="prose prose-blue max-w-none">
                        <ReactMarkdown>{topic.textContent}</ReactMarkdown>
                      </div>
                    </div>

                    {/* YouTube Resources Sub-Card */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-700 mb-2">YouTube Resources</h5>
                      {topic.resources && topic.resources.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {topic.resources.map((res, idx2) => (
                            res.type === 'youtube' ? (
                              <div key={idx2} className="aspect-video">
                                <iframe
                                  src={`https://www.youtube.com/embed/${res.url.split('v=')[1]}`}
                                  title="YouTube video"
                                  className="w-full h-full rounded-md"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            ) : null
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm">No resources available.</div>
                      )}
                    </div>

                    {/* Mark as Completed Button */}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={async () => {
                          const newStatus = topic.status === 'completed' ? 'incomplete' : 'completed';
                          setPlan(prevPlan => {
                            const updatedTopics = prevPlan.topics.map((t, i) =>
                              i === idx ? { ...t, status: newStatus } : t
                            );
                            return { ...prevPlan, topics: updatedTopics };
                          });
                          try {
                            await updateTopicStatus(id, idx, newStatus);
                          } catch (error) {
                            console.error('Failed to update topic status:', error);
                          }
                        }}
                        disabled={topic.status === 'completed'}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {topic.status === 'completed' ? 'Completed' : 'Mark as Completed'}
                      </button>
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