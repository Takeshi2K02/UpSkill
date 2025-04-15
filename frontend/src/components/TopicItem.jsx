import { X } from 'lucide-react';
export default function TopicItem({ topic, index, onChange, onSelect, onClear }) {
  return (
    <div className="mb-4">
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
      <div className="flex flex-wrap gap-2 mb-2">
        {topic.suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(index, s)}
            className={`text-sm px-3 py-1.5 border rounded-full transition ${
              topic.name === s ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-blue-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button className="text-sm px-3 py-1.5 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
          + Add Text Content
        </button>
        <button className="text-sm px-3 py-1.5 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
          + Add Resources
        </button>
      </div>
    </div>
  );
}