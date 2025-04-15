// 📄 CreateLearningPlan.jsx (Page Wrapper)
import React, { useState, useEffect } from 'react';
import CommonLayout from '../layouts/CommonLayout';
import TitleInput from '../components/TitleInput';
import DescriptionInput from '../components/DescriptionInput';
import TopicList from '../components/TopicList';

export default function CreateLearningPlan() {
  const [selectedTitle, setSelectedTitle] = useState('');
  const [suggestedTitles, setSuggestedTitles] = useState([]);
  const [topics, setTopics] = useState([]);
  const [usedTopicSuggestions, setUsedTopicSuggestions] = useState([]);

  useEffect(() => {
    setSuggestedTitles([
      'Mastering React for Web Development',
      'Learn MERN Stack from Scratch',
      'Frontend Basics with HTML, CSS, JS',
      'Become a Fullstack Developer',
      'Intro to Modern JavaScript Frameworks',
    ]);
  }, []);

  const generateTopicSuggestions = () => [
    'React Components',
    'State Management',
    'Hooks Deep Dive',
    'Routing with React Router',
    'Testing React Apps',
  ];

  const handleTopicChange = (index, value) => {
    const previous = topics[index].name;
    let updatedUsed = [...usedTopicSuggestions];

    // If clearing, remove from used
    if (previous && value === '' && updatedUsed.includes(previous)) {
      updatedUsed = updatedUsed.filter((s) => s !== previous);
    }

    const updatedTopics = topics.map((topic, i) => {
      const currentName = i === index ? value : topic.name;
      const dynamicUsed = [...updatedUsed];
      if (i !== index && currentName && !dynamicUsed.includes(currentName)) {
        dynamicUsed.push(currentName);
      }
      return {
        ...topic,
        name: currentName,
        suggestions: generateTopicSuggestions().filter((s) => !dynamicUsed.includes(s)),
      };
    });

    setUsedTopicSuggestions(updatedUsed);
    setTopics(updatedTopics);
  };

  const handleAddTopic = () => {
    const availableSuggestions = generateTopicSuggestions().filter(
      (s) => !usedTopicSuggestions.includes(s)
    );
    setTopics([...topics, { name: '', suggestions: availableSuggestions }]);
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
        suggestions: generateTopicSuggestions().filter((s) => !dynamicUsed.includes(s)),
      };
    });

    setUsedTopicSuggestions(updatedUsed);
    setTopics(updatedTopics);
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
        <DescriptionInput />
        <TopicList
          topics={topics}
          onTopicChange={handleTopicChange}
          onSelectSuggestion={handleSelectSuggestedTopic}
          onAddTopic={handleAddTopic}
        />
      </div>
    </CommonLayout>
  );
}