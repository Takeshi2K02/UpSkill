// src/components/TopicList.jsx
import React from 'react';
import TopicItem from './TopicItem';

export default function TopicList({
  topics,
  onTopicChange,
  onSelectSuggestion,
  onAddTopic,
  onSaveLearningPlan,
  onClearTopic,
  canSave,
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
          disabled={!canSave()}
          className={`inline-flex items-center px-4 py-2 text-sm rounded ${
            canSave()
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
