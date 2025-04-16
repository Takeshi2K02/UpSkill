import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, ChevronDown, ExternalLink, Search } from 'lucide-react';

export default function TopicItem({ topic, index, onChange, onSelect, onClear }) {
  const [showTextContent, setShowTextContent] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideos, setSelectedVideos] = useState([]);

  const defaultVideos = [
    {
      id: '1',
      title: 'React Tutorial',
      thumbnail: 'https://img.youtube.com/vi/dGcsHMXbSOA/0.jpg',
      url: 'https://www.youtube.com/watch?v=dGcsHMXbSOA',
      description: 'Beginner-friendly walkthrough on React fundamentals.',
    },
    {
      id: '2',
      title: 'Understanding State',
      thumbnail: 'https://img.youtube.com/vi/O6P86uwfdR0/0.jpg',
      url: 'https://www.youtube.com/watch?v=O6P86uwfdR0',
      description: 'Deep dive into useState and managing component state.',
    },
    {
      id: '3',
      title: 'Hooks Explained',
      thumbnail: 'https://img.youtube.com/vi/f687hBjwFcM/0.jpg',
      url: 'https://www.youtube.com/watch?v=f687hBjwFcM',
      description: 'Learn React Hooks with simple examples and best practices.',
    },
    {
      id: '4',
      title: 'React Router Guide',
      thumbnail: 'https://img.youtube.com/vi/Law7wfdg_ls/0.jpg',
      url: 'https://www.youtube.com/watch?v=Law7wfdg_ls',
      description: 'How routing works in React with code walkthrough.',
    },
    {
      id: '5',
      title: 'Testing React Components',
      thumbnail: 'https://img.youtube.com/vi/3e1GHf0b6bY/0.jpg',
      url: 'https://www.youtube.com/watch?v=3e1GHf0b6bY',
      description: 'Testing tips and tools for modern React apps.',
    },
  ];

  const [suggestedVideos, setSuggestedVideos] = useState(defaultVideos);

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    const dummyResults = [
      {
        id: '101',
        title: `Results for "${searchQuery}"`,
        thumbnail: 'https://img.youtube.com/vi/ysz5S6PUM-U/0.jpg',
        url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
        description: `Auto-generated results for "${searchQuery}" using AI`,
      },
      {
        id: '102',
        title: `More on ${searchQuery}`,
        thumbnail: 'https://img.youtube.com/vi/ktjafK4SgWM/0.jpg',
        url: 'https://www.youtube.com/watch?v=ktjafK4SgWM',
        description: `Second video matching the search: "${searchQuery}"`,
      },
      {
        id: '103',
        title: `${searchQuery} Explained Simply`,
        thumbnail: 'https://img.youtube.com/vi/Ke90Tje7VS0/0.jpg',
        url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
        description: `Short explanation video about ${searchQuery}`,
      },
      {
        id: '104',
        title: `Top 5 Tips for ${searchQuery}`,
        thumbnail: 'https://img.youtube.com/vi/NpEaa2P7qZI/0.jpg',
        url: 'https://www.youtube.com/watch?v=NpEaa2P7qZI',
        description: `Tutorial with tips about ${searchQuery}`,
      },
      {
        id: '105',
        title: `Why Learn ${searchQuery}?`,
        thumbnail: 'https://img.youtube.com/vi/UhA4_WX1jHc/0.jpg',
        url: 'https://www.youtube.com/watch?v=UhA4_WX1jHc',
        description: `Exploring the importance of ${searchQuery}`,
      },
    ];
    setSuggestedVideos(dummyResults);
  };

  const toggleVideoSelect = (id) => {
    setSelectedVideos((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  return (
    <div className="mb-4 border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
      {/* Topic Title */}
      <div className="relative mb-2">
        <input
          type="text"
          value={topic.name}
          onChange={(e) => onChange(index, e.target.value)}
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
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none shadow-sm"
              placeholder="Enter text content for this topic..."
            />
            <button
              className="absolute top-3 right-3 text-blue-600 hover:text-blue-800"
              title="Generate with AI"
              onClick={() => console.log(`Generate content for topic ${index + 1}`)}
            >
              <Sparkles size={18} />
            </button>
          </div>
        )}
      </div>

      {/* RESOURCES SECTION */}
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
            {/* Search Bar + Button */}
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

            {/* Video Suggestions */}
            <div className="space-y-4">
              {suggestedVideos.map((vid) => (
                <div
                  key={vid.id}
                  className={`flex items-start gap-4 p-3 border rounded-md transition cursor-pointer ${
                    selectedVideos.includes(vid.id)
                      ? 'border-blue-600 ring-2 ring-blue-300'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onClick={() => toggleVideoSelect(vid.id)}
                >
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-32 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{vid.title}</h4>
                    <p className="text-xs text-gray-600 mb-1 line-clamp-2">{vid.description}</p>
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