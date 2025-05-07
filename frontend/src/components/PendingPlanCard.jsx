import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateLearningPlanDueDate, deleteLearningPlan } from '../services/learningPlanService';
import ConfirmationModal from './ConfirmationModal';
import { FiCalendar, FiPlay, FiMoreVertical } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PendingPlanCard({ plan }) {
  const [dueDate, setDueDate] = useState(plan.dueDate ? new Date(plan.dueDate) : null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmDescription, setConfirmDescription] = useState('');
  const [confirmButtonText, setConfirmButtonText] = useState('Confirm');

  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const calendarRef = useRef(null);
  const optionsRef = useRef(null);

  const planId = plan._id?.$oid || plan.id;

  const handleDateSelect = (date) => {
    if (!date) return;
    setDueDate(date);
    setOpen(false);
  };

  const handleStartLearning = async () => {
    if (!dueDate) {
      toast.error('Please select a due date first!');
      return;
    }
    try {
      setLoading(true);
      const dueDateIsoString = dueDate.toISOString();
      await updateLearningPlanDueDate(planId, dueDateIsoString);
      navigate(`/learning-plan/${planId}`);
    } catch (error) {
      console.error('Failed to start learning plan:', error);
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };  

  const handleDelete = () => {
    setIsOptionsOpen(false);
    setConfirmTitle('Delete Learning Plan?');
    setConfirmDescription('Are you sure you want to delete this learning plan? This action cannot be undone.');
    setConfirmButtonText('Delete');
    setConfirmAction(() => async () => {
      try {
        await deleteLearningPlan(planId);
        window.location.reload(); // simple reload for now
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
        (!calendarRef.current || !calendarRef.current.contains(event.target)) &&
        (!buttonRef.current || !buttonRef.current.contains(event.target)) &&
        (!optionsRef.current || !optionsRef.current.contains(event.target))
      ) {
        setOpen(false);
        setIsOptionsOpen(false);
      }
    }

    if (open || isOptionsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, isOptionsOpen]);

  const handleCardClick = (e) => {
    if (
      !buttonRef.current?.contains(e.target) &&
      !calendarRef.current?.contains(e.target) &&
      !optionsRef.current?.contains(e.target)
    ) {
      setIsExpanded(prev => !prev);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer"
    >
      {/* Title and Buttons */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold text-gray-800 truncate">{plan.title}</h3>

        <div className="flex items-center gap-1">
          {/* Calendar Button */}
          <div className="relative flex items-center justify-center">
            <button
              ref={buttonRef}
              onClick={(e) => {
                e.stopPropagation();
                setOpen((prev) => !prev);
                setIsOptionsOpen(false);
              }}
              disabled={loading}
              className="text-gray-500 hover:text-gray-700 transition p-2"
              title="Due Date"
            >
              <FiCalendar size={20} />
            </button>

            {open && (
              <div ref={calendarRef} className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50">
                <DatePicker
                  selected={dueDate}
                  onChange={handleDateSelect}
                  inline
                  calendarClassName="shadow-lg rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Play Button */}
          <div className="relative flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStartLearning();
              }}
              disabled={loading}
              className="text-gray-500 hover:text-gray-700 transition p-2"
              title="Start Learning Plan"
            >
              <FiPlay size={20} />
            </button>
          </div>

          {/* More Options Button */}
          <div className="relative flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOptionsOpen(prev => !prev);
                setOpen(false);
              }}
              className="text-gray-500 hover:text-gray-700 transition p-2"
              title="More Options"
            >
              <FiMoreVertical size={20} />
            </button>

            {isOptionsOpen && (
              <div ref={optionsRef} className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-36 bg-white border border-gray-300 rounded shadow-lg z-50 py-2">
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

      {/* Due Date */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {dueDate ? `Due: ${dueDate.toLocaleDateString()}` : 'No due date'}
        </p>
      </div>

      {/* Expandable Description */}
      {isExpanded && (
        <div className="mt-4 text-sm text-gray-600 leading-relaxed">
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