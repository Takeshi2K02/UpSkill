// src/components/TopicList.jsx
import React from 'react';
import TopicItem from './TopicItem';

export default function TopicList({
  topics,
  onTopicChange,
  onSelectSuggestion,
  onAddTopic,
  onSaveLearningPlan,
  onClearTopic, // <-- FIX: Ensure this prop is included
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Topics</label>

      {topics.map((topic, i) => (
        <TopicItem
          key={i}
          index={i}
          topic={topic}
          onChange={onTopicChange}
          onSelect={onSelectSuggestion}
          onClear={onClearTopic} // <-- FIX: Pass it down to child
        />
      ))}

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <button
          type="button"
          onClick={onAddTopic}
          className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 text-sm"
        >
          + Add Topic
        </button>

        <button
          type="button"
          onClick={onSaveLearningPlan}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
