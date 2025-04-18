import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateLearningPlanDueDate } from '../services/learningPlanService';
import { FiCalendar, FiPlay, FiMoreVertical } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function PendingPlanCard({ plan }) {
  const [dueDate, setDueDate] = useState(plan.dueDate ? new Date(plan.dueDate) : null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

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
      alert('Please select a due date first!');
      return;
    }

    try {
      setLoading(true);
      const dueDateIsoString = dueDate.toISOString();
      await updateLearningPlanDueDate(planId, dueDateIsoString);
      navigate(`/learning-plan/${planId}`);
    } catch (error) {
      console.error('Failed to start learning plan:', error);
      alert('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    alert('Edit Learning Plan (to be implemented)');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      alert('Deleted Learning Plan (to be implemented)');
    }
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

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-lg transition relative">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{plan.title}</h3>

        {/* Button Group */}
        <div className="flex items-center gap-1">

          {/* Calendar Button */}
          <div className="relative flex items-center justify-center">
            <button
              ref={buttonRef}
              onClick={() => {
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
              <div
                ref={calendarRef}
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50"
              >
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
              onClick={handleStartLearning}
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
              onClick={() => {
                setIsOptionsOpen(prev => !prev);
                setOpen(false);
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
                  onClick={handleEdit}
                  className="w-full text-left text-gray-700 hover:bg-gray-100 px-4 py-2 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
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
        <div className="bg-blue-500 h-full rounded" style={{ width: `0%` }} />
      </div>

      {/* Due Date Display */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {dueDate ? `Due: ${dueDate.toLocaleDateString()}` : 'No due date'}
        </p>
      </div>
    </div>
  );
}