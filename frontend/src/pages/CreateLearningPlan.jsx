import React, { useState, useEffect } from 'react';
import CommonLayout from '../layouts/CommonLayout';
import TitleInput from '../components/TitleInput';
import DescriptionInput from '../components/DescriptionInput';
import TopicList from '../components/TopicList';
import { generatePlanTitlePrompt, generateTopicSuggestionsPrompt } from '../ai/prompts';
import { generateGeminiContent } from '../ai/geminiService';

export default function CreateLearningPlan() {
  const [selectedTitle, setSelectedTitle] = useState('');
  const [suggestedTitles, setSuggestedTitles] = useState([]);
  const [description, setDescription] = useState('');
  const [topics, setTopics] = useState([]);
  const [usedTopicSuggestions, setUsedTopicSuggestions] = useState([]);
  const [cachedAISuggestions, setCachedAISuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

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
    let aiSuggestions = [...cachedAISuggestions];

    if (!aiSuggestions.length && selectedTitle.trim() && description.trim()) {
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
      alert('User not logged in.');
      return;
    }

    const learningPlan = {
      userId,
      title: selectedTitle,
      description,
      topics: topics.map(({ name, textContent, resources }) => ({
        name,
        textContent,
        resources,
        weight: 1.0,
      })),
    };

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/learning-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(learningPlan),
      });

      if (response.ok) {
        alert('Learning plan saved successfully!');
      } else {
        alert('Failed to save learning plan.');
      }
    } catch (error) {
      console.error(error);
      alert('Error while saving learning plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonLayout>
      <div className="p-6 bg-white min-h-screen">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Create Learning Plan</h2>
        <TitleInput
          value={selectedTitle}
          onChange={setSelectedTitle}
          suggestions={suggestedTitles}
        />
        <DescriptionInput
          value={description}
          onChange={setDescription}
          title={selectedTitle}
        />
        <TopicList
          topics={topics}
          onTopicChange={handleTopicChange}
          onSelectSuggestion={handleSelectSuggestedTopic}
          onAddTopic={handleAddTopic}
          onSaveLearningPlan={handleSaveLearningPlan}
          onClearTopic={handleClearTopic}
          loading={loading}
        />
      </div>
    </CommonLayout>
  );
}