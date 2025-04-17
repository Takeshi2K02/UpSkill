import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Search,
} from 'lucide-react';
import { fetchYouTubeVideos } from '../ai/youtubeService';
import { generateTopicContentPrompt } from '../ai/prompts';
import SparkAIButton from '../ai/SparkAIButton';
import { calculateTopicWeight } from '../utils/utils';

export default function TopicItem({ topic, index, onChange, onSelect, onClear }) {
  const [showTextContent, setShowTextContent] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedVideos, setSuggestedVideos] = useState([]);
  const [textContent, setTextContent] = useState(topic.textContent || '');

  const textareaRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (topic.name && topic.name.length > 3) {
        const videos = await fetchYouTubeVideos(topic.name);
        setSuggestedVideos(videos);
      }
    };
    fetchSuggestions();
  }, [topic.name]);

  useEffect(() => {
    const newWeight = calculateTopicWeight(textContent, topic.resources || []);
    onChange(index, 'weight', newWeight);
  }, [textContent, topic.resources]);

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) return;
    const videos = await fetchYouTubeVideos(searchQuery);
    setSuggestedVideos(videos);
  };

  const handleTextContentChange = (value) => {
    setTextContent(value);
    onChange(index, 'textContent', value);
  };

  const toggleVideoSelect = (vid) => {
    const currentResources = topic.resources || [];
    const isSelected = currentResources.some((v) => v.url === vid.url);
    const updated = isSelected
      ? currentResources.filter((v) => v.url !== vid.url)
      : [...currentResources, vid];

    onChange(index, 'resources', updated);
  };

  return (
    <div className="mb-4 border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
      {/* Topic Name */}
      <div className="relative mb-2">
        <input
          type="text"
          value={topic.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 pr-10"
          placeholder={`Topic ${index + 1}`}
        />
        {topic.name && (
          <button
            className="absolute right-3 inset-y-0 my-auto flex items-center text-gray-500 hover:text-gray-700"
            onClick={() => onClear(index)}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {topic.suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(index, s)}
            className={`text-sm px-3 py-1.5 border rounded-full transition ${
              topic.name === s
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-blue-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* TEXT CONTENT */}
      <div className="mb-4">
        <button
          onClick={() => setShowTextContent((prev) => !prev)}
          className="flex items-center text-sm font-medium text-blue-700"
        >
          {showTextContent ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="ml-1">Text Content</span>
        </button>

        {showTextContent && (
          <div className="relative mt-2">
            <textarea
              ref={textareaRef}
              rows={1}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none shadow-sm overflow-hidden min-h-[42px]"
              placeholder="Enter text content for this topic..."
              value={textContent}
              onChange={(e) => {
                handleTextContentChange(e.target.value);
                const el = textareaRef.current;
                if (el) {
                  el.style.height = 'auto';
                  el.style.height = `${el.scrollHeight}px`;
                }
              }}
              onInput={() => {
                const el = textareaRef.current;
                if (el) {
                  el.style.height = 'auto';
                  el.style.height = `${el.scrollHeight}px`;
                }
              }}
            />
            {topic.name && (
              <div className="absolute right-2 inset-y-0 my-auto">
                <SparkAIButton
                  prompt={generateTopicContentPrompt(topic.name)}
                  onResult={(result) => {
                    const cleaned = result.trimEnd();
                    setTextContent(cleaned);
                    onChange(index, 'textContent', cleaned);
                    setTimeout(() => {
                      if (textareaRef.current) {
                        textareaRef.current.style.height = 'auto';
                        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                        textareaRef.current.focus();
                        const length = textareaRef.current.value.length;
                        textareaRef.current.setSelectionRange(length, length);
                      }
                    }, 0);
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* RESOURCES */}
      <div>
        <button
          onClick={() => setShowResources((prev) => !prev)}
          className="flex items-center text-sm font-medium text-blue-700"
        >
          {showResources ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="ml-1">Resources</span>
        </button>

        {showResources && (
          <div className="mt-2 space-y-3">
            <div className="relative flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2"
                placeholder="Search YouTube videos..."
              />
              <button
                onClick={handleSearchSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center gap-1"
              >
                <Search size={16} />
                Search
              </button>
            </div>

            <div className="space-y-4">
              {suggestedVideos.map((vid) => (
                <div
                  key={vid.url}
                  className={`flex items-start gap-4 p-3 border rounded-md transition cursor-pointer ${
                    (topic.resources || []).some((v) => v.url === vid.url)
                      ? 'border-blue-600 ring-2 ring-blue-300'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onClick={() => toggleVideoSelect(vid)}
                >
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-32 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{vid.title}</h4>
                    <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                      {vid.description}
                    </p>
                    <a
                      href={vid.url}
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline text-xs"
                    >
                      <ExternalLink size={14} />
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}