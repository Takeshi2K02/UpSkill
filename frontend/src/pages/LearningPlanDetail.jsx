import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import CommonLayout from '../layouts/CommonLayout';
import { getLearningPlanById, updateTopicStatus, updateLearningPlan } from '../services/learningPlanService';
import confetti from 'canvas-confetti';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import { CaretDown, CaretUp } from 'phosphor-react';
import eventBus from '../utils/eventBus'

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
  const [expandedModules, setExpandedModules] = useState([]);
  const [expandedTextSections, setExpandedTextSections] = useState([]);
  const [expandedResourceSections, setExpandedResourceSections] = useState([]);


  const toggleModule = (index) => {
    setExpandedModules((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };  

  const toggleTextSection = (index) => {
    setExpandedTextSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  
  const toggleResourceSection = (index) => {
    setExpandedResourceSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

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
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-blue-800 tracking-tight mb-2">
                🚀 {plan.title}
              </h2>
              <div className="mx-auto w-24 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full shadow-sm" />
            </div>

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

            <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-xl shadow-sm p-5 mb-10">
              <div className="flex items-start gap-3">
                <div className="text-blue-500 text-xl mt-1">🧠</div>
                <div>
                  <h3 className="text-md font-semibold text-blue-700 mb-2">Plan Overview</h3>
                  <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                    {plan.description}
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Modules</h3>

            <div className="space-y-6">
              {plan.topics.map((topic, idx) => {
                const isExpanded = expandedModules.includes(idx);
                return (
                  <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-200">
                    {/* Header */}
                    <div
                      className="flex items-center justify-between p-5 cursor-pointer select-none"
                      onClick={() => toggleModule(idx)}
                    >
                      <h4 className="text-lg font-semibold text-gray-800">{topic.name}</h4>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm px-2 py-1 rounded-full font-medium ${topic.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {topic.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                        <button className="text-blue-600 text-xl focus:outline-none">
                        {isExpanded ? <CaretUp size={20} weight="bold" /> : <CaretDown size={20} weight="bold" />}
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Body */}
                    {isExpanded && (
                      <div className="p-6 pt-0 flex flex-col gap-6">
                        
                        {/* Module Content */}
                        <div className="bg-gray-50 rounded-lg px-4 pt-4 pb-2">
                          <div
                            className="flex items-center justify-between mb-2 cursor-pointer"
                            onClick={() => toggleTextSection(idx)}
                          >
                            <div className="text-sm font-semibold text-blue-700 flex items-center gap-1">
                            {expandedTextSections.includes(idx) ? <CaretUp size={16} weight="bold" /> : <CaretDown size={16} weight="bold" />}
                            <span>Module Content</span>
                            </div>

                            <label
                              className="flex items-center gap-2 text-sm cursor-pointer"
                              onClick={(e) => e.stopPropagation()} // prevent parent toggle on checkbox click
                            >
                              <input
                                type="checkbox"
                                checked={topic.textCompleted || false}
                                onChange={async (e) => {
                                  const updatedTopics = [...plan.topics];
                                  updatedTopics[idx].textCompleted = e.target.checked;

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
                                    eventBus.emit('planUpdated');
                                  } catch (error) {
                                    console.error('Failed to update text progress:', error);
                                  }
                                }}
                                className="h-4 w-4 accent-green-600"
                              />
                              <span className="text-green-700 font-medium">Mark as Read</span>
                            </label>
                          </div>

                          {expandedTextSections.includes(idx) && (
                            <div className="prose prose-blue max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:mb-3 [&_p]:mb-4 pb-2">
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
                          )}
                        </div>

                        {/* Online Resources */}
                        <div className="bg-gray-50 rounded-lg px-4 pt-4 pb-2">
                          <div
                            className="flex items-center justify-between mb-2 cursor-pointer"
                            onClick={() => toggleResourceSection(idx)}
                          >
                            <div className="text-sm font-semibold text-blue-700 flex items-center gap-1">
                            {expandedResourceSections.includes(idx) ? <CaretUp size={16} weight="bold" /> : <CaretDown size={16} weight="bold" />}
                            <span>Online Resources</span>
                            </div>

                            {topic.resources?.length > 0 && (
                              <label
                                className="flex items-center gap-2 text-sm cursor-pointer"
                                onClick={(e) => e.stopPropagation()} // prevent toggle
                              >
                                {/* Checkbox is marked if ALL resources are watched */}
                                <input
                                  type="checkbox"
                                  checked={topic.resourceCompletion?.every(Boolean) || false}
                                  onChange={async (e) => {
                                    const updatedTopics = [...plan.topics];
                                    if (!updatedTopics[idx].resourceCompletion) {
                                      updatedTopics[idx].resourceCompletion = new Array(topic.resources.length).fill(false);
                                    }
                                    const checked = e.target.checked;
                                    updatedTopics[idx].resourceCompletion = updatedTopics[idx].resourceCompletion.map(() => checked);

                                    const textDone = updatedTopics[idx].textCompleted;
                                    const newStatus = textDone && checked ? 'completed' : 'incomplete';
                                    if (newStatus === 'completed' && updatedTopics[idx].status !== 'completed') {
                                      celebrate();
                                    }
                                    updatedTopics[idx].status = newStatus;

                                    const updatedPlan = { ...plan, topics: updatedTopics };
                                    setPlan(JSON.parse(JSON.stringify(updatedPlan)));
                                    try {
                                      await updateLearningPlan(plan._id, updatedPlan);
                                      eventBus.emit('planUpdated');
                                    } catch (error) {
                                      console.error('Failed to update bulk video progress:', error);
                                    }
                                  }}
                                  className="h-4 w-4 accent-green-600"
                                />
                                <span className="text-green-700 font-medium">Mark as Watched</span>
                              </label>
                            )}
                          </div>

                          {expandedResourceSections.includes(idx) && (
                            <>
                              {topic.resources && topic.resources.length > 0 ? (
                                <div className="space-y-4 pt-2">
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
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="text-gray-400 text-sm">No resources available.</div>
                              )}
                            </>
                          )}
                        </div>


                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p className="text-center text-red-500">Learning Plan not found.</p>
        )}
      </div>
    </CommonLayout>
  );
}