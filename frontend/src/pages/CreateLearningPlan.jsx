import React, { useState, useEffect } from 'react';
import CommonLayout from '../layouts/CommonLayout';
import TitleInput from '../components/TitleInput';
import DescriptionInput from '../components/DescriptionInput';
import TopicList from '../components/TopicList';
import { generatePlanTitlePrompt, generateTopicSuggestionsPrompt } from '../ai/prompts';
import { generateGeminiContent } from '../ai/geminiService';
import { normalizeWeights } from '../utils/weightUtils';
import { createLearningPlan } from '../services/learningPlanService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateLearningPlan() {
  const [selectedTitle, setSelectedTitle] = useState('');
  const [suggestedTitles, setSuggestedTitles] = useState([]);
  const [description, setDescription] = useState('');
  const [topics, setTopics] = useState([]);
  const [usedTopicSuggestions, setUsedTopicSuggestions] = useState([]);
  const [cachedAISuggestions, setCachedAISuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [descError, setDescError] = useState('');

  const canSave = () => {
    if (!selectedTitle.trim()) return false;
    if (!description.trim()) return false;
    if (topics.length === 0) return false;
    const validTopics = topics.filter((t) =>
      t.name.trim() !== '' &&
      (t.textContent.trim() !== '' || (Array.isArray(t.resources) && t.resources.length > 0))
    );
    if (validTopics.length === 0) return false;
    return true;
  };

  useEffect(() => {
    if (selectedTitle.trim()) setTitleError('');
  }, [selectedTitle]);

  useEffect(() => {
    if (description.trim()) setDescError('');
  }, [description]);

  const handleTitleChange = async (newTitle) => {
    setSelectedTitle(newTitle);
    setTopics([]);
    setUsedTopicSuggestions([]);
    setCachedAISuggestions([]);
    if (newTitle.trim() && description.trim()) {
      const prompt = generateTopicSuggestionsPrompt(newTitle, description);
      const result = await generateGeminiContent(prompt);
      const aiSuggestions = result
        .split('\n')
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
        .slice(0, 5);
      setCachedAISuggestions(aiSuggestions);
    }
  };

  useEffect(() => {
    const fetchSuggestedTitles = async () => {
      const prompt = generatePlanTitlePrompt;
      const result = await generateGeminiContent(prompt);
      const titles = result
        .split('\n')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      setSuggestedTitles(titles);
    };
    fetchSuggestedTitles();
  }, []);

  const handleTopicChange = (index, field, value) => {
    const updated = [...topics];
    updated[index] = { ...updated[index], [field]: value };
    setTopics(updated);
  };

  const handleAddTopic = async () => {
    let valid = true;
    if (!selectedTitle.trim()) {
      setTitleError('Please enter or select a title before adding a topic.');
      valid = false;
    } else {
      setTitleError('');
    }
    if (!description.trim()) {
      setDescError('Please write a description before adding a topic.');
      valid = false;
    } else {
      setDescError('');
    }
    if (!valid) return;

    let aiSuggestions = [...cachedAISuggestions];
    if (!aiSuggestions.length) {
      const prompt = generateTopicSuggestionsPrompt(selectedTitle, description);
      const result = await generateGeminiContent(prompt);
      aiSuggestions = result
        .split('\n')
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
        .slice(0, 5);
      setCachedAISuggestions(aiSuggestions);
    }

    const availableSuggestions = aiSuggestions.filter(
      (s) => !usedTopicSuggestions.includes(s)
    );

    setTopics([
      ...topics,
      {
        name: '',
        textContent: '',
        resources: [],
        suggestions: availableSuggestions,
      },
    ]);
  };

  const handleSelectSuggestedTopic = (index, topicName) => {
    const previous = topics[index].name;
    let updatedUsed = [...usedTopicSuggestions];
    if (previous && updatedUsed.includes(previous)) {
      updatedUsed = updatedUsed.filter((t) => t !== previous);
    }
    if (!updatedUsed.includes(topicName)) {
      updatedUsed.push(topicName);
    }

    const updatedTopics = topics.map((topic, i) => {
      const currentName = i === index ? topicName : topic.name;
      const dynamicUsed = [...updatedUsed];
      if (i !== index && currentName && !dynamicUsed.includes(currentName)) {
        dynamicUsed.push(currentName);
      }
      return {
        ...topic,
        name: currentName,
        suggestions: cachedAISuggestions.filter(
          (s) => !dynamicUsed.includes(s)
        ),
      };
    });

    setUsedTopicSuggestions(updatedUsed);
    setTopics(updatedTopics);
  };

  const handleClearTopic = (index) => {
    const clearedTopic = topics[index].name;
    if (!clearedTopic) return;
    const updatedUsed = usedTopicSuggestions.filter((t) => t !== clearedTopic);
    const updatedTopics = topics.map((topic, i) => ({
      ...topic,
      name: i === index ? '' : topic.name,
      suggestions: cachedAISuggestions.filter(
        (s) =>
          !updatedUsed.includes(s) &&
          (i === index || s !== topic.name)
      ),
    }));
    setUsedTopicSuggestions(updatedUsed);
    setTopics(updatedTopics);
  };

  const handleSaveLearningPlan = async () => {
    const userId = sessionStorage.getItem('facebookId');
    if (!userId) {
      toast.error('User not logged in.');
      return;
    }

    const learningPlan = {
      userId,
      title: selectedTitle,
      description,
      topics: normalizeWeights(topics).map(topic => ({
        ...topic,
        status: 'incomplete',
      })),
    };

    try {
      setLoading(true);
      await createLearningPlan(learningPlan);
      toast.success('Learning plan saved successfully!');
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Error while saving learning plan.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedTitle('');
    setDescription('');
    setTopics([]);
    setUsedTopicSuggestions([]);
    setCachedAISuggestions([]);
  };

  return (
    <CommonLayout>
      <div className="p-6 bg-white min-h-screen">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Create Learning Plan</h2>
        <TitleInput
          value={selectedTitle}
          onChange={handleTitleChange}
          suggestions={suggestedTitles}
        />
        {titleError && <p className="text-red-600 text-sm mt-1">{titleError}</p>}
        <DescriptionInput
          value={description}
          onChange={setDescription}
          title={selectedTitle}
        />
        {descError && <p className="text-red-600 text-sm mt-1">{descError}</p>}
        <TopicList
          topics={topics}
          onTopicChange={handleTopicChange}
          onSelectSuggestion={handleSelectSuggestedTopic}
          onAddTopic={handleAddTopic}
          onSaveLearningPlan={handleSaveLearningPlan}
          onClearTopic={handleClearTopic}
          loading={loading}
          canSave={canSave}
        />
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </CommonLayout>
  );
}