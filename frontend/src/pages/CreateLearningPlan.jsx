// src/pages/CreateLearningPlan.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import CommonLayout from '../layouts/CommonLayout';

export default function CreateLearningPlan() {
  const [suggestedTitles, setSuggestedTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [topics, setTopics] = useState([]);
  const [usedTopicSuggestions, setUsedTopicSuggestions] = useState([]);

  // Title suggestions on page load
  useEffect(() => {
    const titles = [
      'Mastering React for Web Development',
      'Learn MERN Stack from Scratch',
      'Frontend Basics with HTML, CSS, JS',
      'Become a Fullstack Developer',
      'Intro to Modern JavaScript Frameworks',
    ];
    setSuggestedTitles(titles);
  }, []);

  // Initial topic suggestions when first topic is added
  useEffect(() => {
    if (topics.length === 0) {
      handleAddTopic();
    }
  }, []);

  const generateTopicSuggestions = () => [
    'React Components',
    'State Management',
    'Hooks Deep Dive',
    'Routing with React Router',
    'Testing React Apps',
  ];

  const handleTitleClear = () => setSelectedTitle('');

  const handleTopicChange = (index, value) => {
    const prev = topics[index].name;
    const updatedUsed = [...usedTopicSuggestions];
  
    // If clearing a previously selected suggestion
    if (prev && value === '' && updatedUsed.includes(prev)) {
      updatedUsed.splice(updatedUsed.indexOf(prev), 1);
    }
  
    const updated = topics.map((topic, i) => ({
      ...topic,
      name: i === index ? value : topic.name,
      suggestions: generateTopicSuggestions().filter((s) => !updatedUsed.includes(s)),
    }));
  
    setUsedTopicSuggestions(updatedUsed);
    setTopics(updated);
  };
  

  const handleAddTopic = () => {
    const allSuggestions = generateTopicSuggestions();
    const availableSuggestions = allSuggestions.filter(
      (suggestion) => !usedTopicSuggestions.includes(suggestion)
    );

    setTopics([
      ...topics,
      {
        name: '',
        suggestions: availableSuggestions,
      },
    ]);
  };

  const handleSelectSuggestedTopic = (index, topicName) => {
    const previous = topics[index].name;
  
    // Step 1: Rebuild used topic list
    let updatedUsed = [...usedTopicSuggestions];
    if (previous && updatedUsed.includes(previous)) {
      updatedUsed = updatedUsed.filter((t) => t !== previous);
    }
    if (!updatedUsed.includes(topicName)) {
      updatedUsed.push(topicName);
    }
  
    // Step 2: Update topics and recalculate suggestions for all
    const updatedTopics = topics.map((topic, i) => {
      const suggestions = generateTopicSuggestions().filter((s) => !updatedUsed.includes(s));
      return {
        ...topic,
        name: i === index ? topicName : topic.name,
        suggestions,
      };
    });
  
    setUsedTopicSuggestions(updatedUsed);
    setTopics(updatedTopics);
  };
    
  
  return (
    <CommonLayout>
      <div className="p-6 bg-white min-h-screen">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Create Learning Plan</h2>

        {/* Title Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Plan Title</label>
          <div className="relative">
            <input
              type="text"
              value={selectedTitle}
              onChange={(e) => setSelectedTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 pr-10"
              placeholder="Enter or select a title"
            />
            {selectedTitle && (
              <button
                className="absolute right-3 inset-y-0 my-auto flex items-center text-gray-500 hover:text-gray-700"
                onClick={handleTitleClear}
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Suggested Titles */}
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestedTitles.map((title, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTitle(title)}
                className={`text-sm px-3 py-1.5 border rounded-full transition ${
                  selectedTitle === title
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-blue-50'
                }`}
              >
                {title}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows="3"
            placeholder="Write a short description..."
          />
        </div>

        {/* Topics Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Topics</label>
          {topics.map((topic, index) => (
            <div key={index} className="mb-4">
              <div className="relative mb-2">
                <input
                  type="text"
                  value={topic.name}
                  onChange={(e) => handleTopicChange(index, e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 pr-10"
                  placeholder={`Topic ${index + 1}`}
                />
                {topic.name && (
                  <button
                    className="absolute right-3 inset-y-0 my-auto flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => handleTopicChange(index, '')}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>


              {/* Suggested Topics */}
              {topic.suggestions && topic.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {topic.suggestions.map((suggestion, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSelectSuggestedTopic(index, suggestion)}
                      className={`text-sm px-3 py-1.5 border rounded-full transition ${
                        topic.name === suggestion
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-blue-50'
                      }`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* Topic Actions */}
              <div className="flex gap-3">
                <button className="text-sm px-3 py-1.5 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
                  + Add Text Content
                </button>
                <button className="text-sm px-3 py-1.5 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
                  + Add Resources
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddTopic}
            className="mt-2 inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 text-sm"
          >
            + Add Topic
          </button>
        </div>
      </div>
    </CommonLayout>
  );
}