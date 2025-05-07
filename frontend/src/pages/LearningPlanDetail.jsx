import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import CommonLayout from '../layouts/CommonLayout';
import { getLearningPlanById, updateTopicStatus, updateLearningPlan } from '../services/learningPlanService';
import confetti from 'canvas-confetti';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';


export default function LearningPlanDetail() {
  const celebrate = () => {
    const duration = 2 * 1000; // 2 seconds
    const animationEnd = Date.now() + duration;
  
    const skew = 1;
  
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
  
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }
  
      const particleCount = 200 * (timeLeft / duration); // ✨ Higher particle count
      confetti({
        particleCount,
        startVelocity: 45,
        spread: 360,
        angle: 90,
        ticks: 80,
        gravity: 1.2,
        origin: {
          x: Math.random(),
          y: Math.random() * 0.4
        },
        scalar: 1.2, // Slightly larger particles
        zIndex: 999
      });
    }, 200);
  };  
  
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await getLearningPlanById(id);

        // Ensure _id is available for update calls
        if (!data._id && data.id) {
          data._id = data.id;
        }

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
            <div className="mb-10 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-md font-semibold text-blue-700 flex items-center gap-2">
                  📈 Progress
                </h4>
                <span className="text-sm font-medium text-blue-800">
                  {progress}% completed
                </span>
              </div>
              <div className="relative w-full h-4 bg-blue-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 shadow-md transition-all duration-500 ease-out"
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
                    <span className={`text-sm px-2 py-1 rounded-full font-medium ${topic.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {topic.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
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
                          
                            // ✅ Update topic.status based on all content
                            const allVideosDone = updatedTopics[idx].resourceCompletion?.every(Boolean);
                            const newStatus = e.target.checked && allVideosDone ? 'completed' : 'incomplete';
                            if (newStatus === 'completed' && updatedTopics[idx].status !== 'completed') {
                              celebrate();
                            }
                            updatedTopics[idx].status = newStatus;

                          
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
                    <div className="prose prose-blue max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:mb-3 [&_p]:mb-4">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          li: ({ children }) => <li className="mb-2">{children}</li>,
                          p: ({ children }) => <p className="mb-4">{children}</p>,
                        }}
                      >
                        {topic.textContent}
                      </ReactMarkdown>
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
                                  
                                    // ✅ Update topic.status based on all content
                                    const allVideosDone = updatedTopics[idx].resourceCompletion.every(Boolean);
                                    const textDone = updatedTopics[idx].textCompleted;
                                    const newStatus = textDone && allVideosDone ? 'completed' : 'incomplete';
                                    if (newStatus === 'completed' && updatedTopics[idx].status !== 'completed') {
                                      confetti({ spread: 80, particleCount: 60, origin: { y: 0.6 } });
                                    }
                                    updatedTopics[idx].status = newStatus;

                                  
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