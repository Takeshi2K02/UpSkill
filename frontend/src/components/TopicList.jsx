import React from 'react';
import TopicItem from './TopicItem';

export default function TopicList({ topics, onTopicChange, onSelectSuggestion, onAddTopic }) {
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
          onClear={(index) => onTopicChange(index, '')} // same as setting it to ''
        />
      ))}
      <button
        type="button"
        onClick={onAddTopic}
        className="mt-2 inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 text-sm"
      >
        + Add Topic
      </button>
    </div>
  );
}