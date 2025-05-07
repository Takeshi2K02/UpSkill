import React, { useState, useEffect } from 'react';
import CommonLayout from '../layouts/CommonLayout';
import TitleInput from '../components/TitleInput';
import DescriptionInput from '../components/DescriptionInput';
import TopicList from '../components/TopicList';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getLearningPlanById, updateLearningPlan } from '../services/learningPlanService';
import { normalizeWeights } from '../utils/weightUtils';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditLearningPlan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedTitle, setSelectedTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topics, setTopics] = useState([]);
  const [dueDate, setDueDate] = useState(null);

  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [descError, setDescError] = useState('');

  useEffect(() => {
    async function fetchLearningPlan() {
      try {
        setLoading(true);
        const plan = await getLearningPlanById(id);
        setSelectedTitle(plan.title || '');
        setDescription(plan.description || '');
        setTopics(
          (plan.topics || []).map(topic => ({
            ...topic,
            suggestions: topic.suggestions || []
          }))
        );
        setDueDate(plan.dueDate ? new Date(plan.dueDate) : null);
      } catch (error) {
        console.error('Failed to load learning plan:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLearningPlan();
  }, [id]);

  const handleTitleChange = (newTitle) => {
    setSelectedTitle(newTitle);
  };

  const handleTopicChange = (index, field, value) => {
    const updated = [...topics];
    updated[index] = { ...updated[index], [field]: value };
    setTopics(updated);
  };

  const handleClearTopic = (index) => {
    const updated = [...topics];
    updated.splice(index, 1);
    setTopics(updated);
  };

  const handleAddTopic = () => {
    setTopics([...topics, { name: '', textContent: '', resources: [], suggestions: [] }]);
  };

  const canSave = () => {
    if (!selectedTitle.trim()) return false;
    if (!description.trim()) return false;
    if (topics.length === 0) return false;
    return true;
  };

  const handleSaveLearningPlan = async () => {
    if (!canSave()) {
      if (!selectedTitle.trim()) setTitleError('Please enter a title.');
      if (!description.trim()) setDescError('Please enter a description.');
      return;
    }
  
    try {
      setLoading(true);
      const learningPlan = {
        title: selectedTitle,
        description,
        topics: normalizeWeights(topics),
        dueDate: dueDate ? dueDate.toISOString() : null,
      };
      await updateLearningPlan(id, learningPlan);
      toast.success('Learning plan updated successfully!');
      setTimeout(() => navigate('/learning-plans'), 1500);
    } catch (error) {
      console.error('Error updating learning plan:', error);
      toast.error('Failed to update learning plan.');
    } finally {
      setLoading(false);
    }
  };      

  return (
    <CommonLayout>
      <div className="p-6 bg-white min-h-screen">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Edit Learning Plan</h2>

        <TitleInput value={selectedTitle} onChange={handleTitleChange} suggestions={[]} />
        {titleError && <p className="text-red-600 text-sm mt-1">{titleError}</p>}

        <DescriptionInput value={description} onChange={setDescription} title={selectedTitle} />
        {descError && <p className="text-red-600 text-sm mt-1">{descError}</p>}

        <TopicList
          topics={topics}
          onTopicChange={handleTopicChange}
          onSelectSuggestion={() => {}} // No AI suggestions during edit
          onAddTopic={handleAddTopic}
          onSaveLearningPlan={handleSaveLearningPlan}
          onClearTopic={handleClearTopic}
          canSave={canSave}
        />

        {/* Due Date Field */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">Due Date</label>
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border border-gray-300 rounded px-4 py-2 w-full"
            placeholderText="Select a due date"
          />
        </div>
      </div>
    </CommonLayout>
  );
}
