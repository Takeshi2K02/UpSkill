import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlay, FiMoreVertical } from 'react-icons/fi';

export default function CurrentPlanCard({ plan }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const optionsRef = useRef(null);

  const planId = plan._id?.$oid || plan.id;

  const handleCardClick = () => {
    setIsExpanded(prev => !prev);
  };

  const handleStartLearning = () => {
    navigate(`/learning-plan/${planId}`);
  };

  const handleEdit = () => {
    navigate(`/learning-plan/edit/${planId}`);
  };  

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      alert('Deleted Learning Plan (to be implemented)');
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isOptionsOpen &&
        optionsRef.current &&
        !optionsRef.current.contains(event.target)
      ) {
        setIsOptionsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOptionsOpen]);

  const dueDate = plan.dueDate ? new Date(plan.dueDate) : null;

  // Calculate progress based on topics
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

  const progress = calculateProgress(plan);

  return (
    <div
      onClick={handleCardClick}
      className="bg-white p-4 rounded shadow hover:shadow-lg transition relative cursor-pointer"
    >
      {/* Title and Buttons */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{plan.title}</h3>

        {/* Play and More Options */}
        <div className="flex items-center gap-2">
          {/* Play Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStartLearning();
            }}
            className="text-gray-500 hover:text-gray-700 transition p-2"
            title="Start Learning Plan"
          >
            <FiPlay size={20} />
          </button>

          {/* More Options Button */}
          <div className="relative flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOptionsOpen(prev => !prev);
              }}
              className="text-gray-500 hover:text-gray-700 transition p-2"
              title="More Options"
            >
              <FiMoreVertical size={20} />
            </button>

            {isOptionsOpen && (
              <div
                ref={optionsRef}
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-36 bg-white border border-gray-300 rounded shadow-lg z-50 py-2"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit();
                  }}
                  className="w-full text-left text-gray-700 hover:bg-gray-100 px-4 py-2 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="w-full text-left text-red-600 hover:bg-gray-100 hover:text-red-700 px-4 py-2 text-sm"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded mb-2">
        <div
          className="bg-blue-500 h-full rounded"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Due Date */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {dueDate ? `Due: ${dueDate.toLocaleDateString()}` : 'No due date'}
        </p>
      </div>

      {/* Expandable Description */}
      {isExpanded && (
        <div className="mt-4 text-sm text-gray-600">
          {plan.description || 'No description available.'}
        </div>
      )}
    </div>
  );
}