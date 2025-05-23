import React, { useState, useRef, useEffect } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import { deleteLearningPlan } from '../services/learningPlanService';
import ConfirmationModal from './ConfirmationModal';

export default function CompletedPlanCard({ plan }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmDescription, setConfirmDescription] = useState('');
  const [confirmButtonText, setConfirmButtonText] = useState('Confirm');

  const optionsRef = useRef(null);

  const handleCardClick = () => {
    setIsExpanded(prev => !prev);
  };

  const handleEdit = () => {
    alert('Edit Learning Plan (to be implemented)');
  };

  const handleDelete = () => {
    setIsOptionsOpen(false);
    setConfirmTitle('Delete Learning Plan?');
    setConfirmDescription('Are you sure you want to delete this learning plan? This action cannot be undone.');
    setConfirmButtonText('Delete');
    setConfirmAction(() => async () => {
      try {
        await deleteLearningPlan(plan._id?.$oid || plan.id);
        window.location.reload(); // simple reload
      } catch (error) {
        console.error('Failed to delete learning plan:', error);
        alert('Failed to delete learning plan.');
      }
    });
    setConfirmModalOpen(true);
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

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer"
    >
      {/* Title and Three Dots */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 truncate">{plan.title}</h3>

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

      {/* Expandable Description */}
      {isExpanded && (
        <div className="mt-3 text-sm text-gray-600 leading-relaxed">
          {plan.description || 'No description available.'}
        </div>
      )}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        title={confirmTitle}
        description={confirmDescription}
        confirmText={confirmButtonText}
        onCancel={() => setConfirmModalOpen(false)}
        onConfirm={() => {
          setConfirmModalOpen(false);
          confirmAction();
        }}
      />
    </div>
  );
}