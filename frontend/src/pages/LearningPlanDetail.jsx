import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import CommonLayout from '../layouts/CommonLayout';
import { getLearningPlanById, updateTopicStatus, updateLearningPlan } from '../services/learningPlanService';

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

    let total = 0;
    let done = 0;

    for (const topic of plan.topics) {
      total += topic.weight || 0;

      if (topic.textCompleted && topic.textWeight) {
        done += topic.textWeight;
      }

      if (Array.isArray(topic.resources) && Array.isArray(topic.resourceCompletion)) {
        for (let i = 0; i < topic.resources.length; i++) {
          const res = topic.resources[i];
          const completed = topic.resourceCompletion[i];
          if (res.weight && completed) {
            done += res.weight;
          }
        }
      }
    }

    if (total === 0) return 0;
    return Math.round((done / total) * 100);
  };

  const progress = useMemo(() => calculateProgress(plan), [plan]);

  const extractVideoId = (url) => {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes('youtu.be')) {
        return parsed.pathname.slice(1);
      }
      return parsed.searchParams.get('v');
    } catch {
      return '';
    }
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
              <p className="text-sm text-gray-600">Progress: {progress}%</p>
              <div className="w-full h-2 bg-gray-200 rounded mt-2">
                <div
                  className="h-full bg-blue-500 rounded"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <p className="text-gray-700 mb-4">{plan.description}</p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Topics</h3>
            <div className="space-y-6">
              {plan.topics.map((topic, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-gray-200">
                  {/* Title and Checkbox */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-800">{topic.name}</h4>
                    <input
                      type="checkbox"
                      checked={topic.status === 'completed'}
                      onChange={async () => {
                        const newStatus = topic.status === 'completed' ? 'incomplete' : 'completed';
                        const updatedTopics = plan.topics.map((t, i) =>
                          i === idx ? { ...t, status: newStatus } : t
                        );
                        const updatedPlan = { ...plan, topics: updatedTopics };
                        setPlan(updatedPlan);
                        try {
                          await updateTopicStatus(id, idx, newStatus);
                        } catch (error) {
                          console.error('Failed to update topic status:', error);
                        }
                      }}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-gray-700">Text Content</h5>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={topic.textCompleted || false}
                          onChange={async (e) => {
                            const updatedTopics = [...plan.topics];
                            updatedTopics[idx].textCompleted = e.target.checked;
                            const updatedPlan = { ...plan, topics: updatedTopics };
                            setPlan(JSON.parse(JSON.stringify(updatedPlan)));
                            try {
                              await updateLearningPlan(plan._id, updatedPlan);
                            } catch (error) {
                              console.error('Failed to update text progress:', error);
                            }
                          }}
                          className="h-4 w-4 text-blue-600"
                        />
                        Mark as Read
                      </label>
                    </div>
                    <div className="prose prose-blue max-w-none">
                      <ReactMarkdown>{topic.textContent}</ReactMarkdown>
                    </div>
                  </div>

                  {/* YouTube Resources */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-700 mb-2">YouTube Resources</h5>
                    {topic.resources && topic.resources.length > 0 ? (
                      <div className="space-y-4">
                        {topic.resources.map((res, idx2) => {
                          const videoId = extractVideoId(res.url);
                          return (
                            <div key={idx2} className="flex flex-col gap-2">
                              <div className="aspect-video">
                                <iframe
                                  src={`https://www.youtube.com/embed/${videoId}`}
                                  title={res.title}
                                  className="w-full h-full rounded-md"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={topic.resourceCompletion?.[idx2] || false}
                                  onChange={async (e) => {
                                    const updatedTopics = [...plan.topics];
                                    if (!updatedTopics[idx].resourceCompletion) {
                                      updatedTopics[idx].resourceCompletion = new Array(topic.resources.length).fill(false);
                                    }
                                    updatedTopics[idx].resourceCompletion[idx2] = e.target.checked;
                                    const updatedPlan = { ...plan, topics: updatedTopics };
                                    setPlan(JSON.parse(JSON.stringify(updatedPlan)));
                                    try {
                                      await updateLearningPlan(plan._id, updatedPlan);
                                    } catch (error) {
                                      console.error('Failed to update video progress:', error);
                                    }
                                  }}
                                  className="h-4 w-4 text-blue-600"
                                />
                                Mark as Watched
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm">No resources available.</div>
                    )}
                  </div>

                  {/* Completion Button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={async () => {
                        const newStatus = topic.status === 'completed' ? 'incomplete' : 'completed';
                        const updatedTopics = plan.topics.map((t, i) =>
                          i === idx ? { ...t, status: newStatus } : t
                        );
                        const updatedPlan = { ...plan, topics: updatedTopics };
                        setPlan(updatedPlan);
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
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-red-500">Learning Plan not found.</p>
        )}
      </div>
    </CommonLayout>
  );
}