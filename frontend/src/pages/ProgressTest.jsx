import React, { useEffect, useState, useMemo } from 'react';

export default function ProgressTest() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem('weightPlan');
    if (raw) {
      const parsed = JSON.parse(raw);
      const enriched = parsed.topics.map(t => ({
        ...t,
        textCompleted: false,
        resourceCompletion: new Array(t.resources.length).fill(false),
      }));
      setTopics(enriched);
    }
  }, []);

  const progress = useMemo(() => {
    let total = 0;
    let done = 0;

    for (const topic of topics) {
      total += topic.weight;

      if (topic.textCompleted) {
        done += topic.textWeight;
      }

      for (let i = 0; i < topic.resources.length; i++) {
        if (topic.resourceCompletion[i]) {
          done += topic.resources[i].weight;
        }
      }
    }

    return Math.round((done / total) * 100);
  }, [topics]);

  const toggleText = (index) => {
    const updated = [...topics];
    updated[index].textCompleted = !updated[index].textCompleted;
    setTopics([...updated]);
  };

  const toggleVideo = (topicIndex, videoIndex) => {
    const updated = [...topics];
    updated[topicIndex].resourceCompletion[videoIndex] =
      !updated[topicIndex].resourceCompletion[videoIndex];
    setTopics([...updated]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Progress: {progress}%</h1>
      <div className="w-full h-2 bg-gray-200 rounded mb-6">
        <div
          className="h-full bg-green-500 rounded"
          style={{ width: `${progress}%` }}
        />
      </div>

      {topics.map((topic, idx) => (
        <div key={idx} className="mb-6 border p-4 rounded-lg">
          <h2 className="font-semibold mb-2">{topic.name}</h2>

          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={topic.textCompleted}
              onChange={() => toggleText(idx)}
            />
            Mark Text as Read
          </label>

          {topic.resources.map((res, vidx) => (
            <label key={vidx} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={topic.resourceCompletion[vidx]}
                onChange={() => toggleVideo(idx, vidx)}
              />
              {res.title}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}