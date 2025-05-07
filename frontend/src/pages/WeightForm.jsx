import React, { useState } from 'react';

export default function WeightForm() {
  const [plan, setPlan] = useState({
    title: '',
    topics: [
      {
        name: '',
        weight: 0,
        textWeight: 0,
        resourceWeights: ['', ''],
      },
    ],
  });

  const updateTopic = (idx, key, value) => {
    const updated = [...plan.topics];
    updated[idx][key] = value;
    setPlan({ ...plan, topics: updated });
  };

  const updateResourceWeight = (topicIdx, resIdx, value) => {
    const updated = [...plan.topics];
    updated[topicIdx].resourceWeights[resIdx] = value;
    setPlan({ ...plan, topics: updated });
  };

  const addTopic = () => {
    setPlan({
      ...plan,
      topics: [
        ...plan.topics,
        { name: '', weight: 0, textWeight: 0, resourceWeights: ['', ''] },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsed = {
      ...plan,
      topics: plan.topics.map((t, i) => ({
        name: t.name,
        weight: parseFloat(t.weight),
        textWeight: parseFloat(t.textWeight),
        resources: t.resourceWeights.map((w, j) => ({
          title: `Video ${i + 1}.${j + 1}`,
          weight: parseFloat(w),
        })),
      })),
    };
    localStorage.setItem('weightPlan', JSON.stringify(parsed));
    alert('Saved to local storage. Open /progress-test to view it.');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-w-3xl mx-auto">
      <label className="block">
        <span className="block font-medium">Plan Title</span>
        <input
          className="border p-2 w-full"
          value={plan.title}
          onChange={(e) => setPlan({ ...plan, title: e.target.value })}
        />
      </label>

      {plan.topics.map((topic, idx) => (
        <div key={idx} className="border p-4 rounded space-y-2">
          <label className="block">
            <span className="block">Topic {idx + 1} Name</span>
            <input
              className="border p-2 w-full"
              value={topic.name}
              onChange={(e) => updateTopic(idx, 'name', e.target.value)}
            />
          </label>
          <label className="block">
            <span className="block">Total Weight</span>
            <input
              type="number"
              step="0.01"
              className="border p-2 w-full"
              value={topic.weight}
              onChange={(e) => updateTopic(idx, 'weight', e.target.value)}
            />
          </label>
          <label className="block">
            <span className="block">Text Content Weight</span>
            <input
              type="number"
              step="0.01"
              className="border p-2 w-full"
              value={topic.textWeight}
              onChange={(e) => updateTopic(idx, 'textWeight', e.target.value)}
            />
          </label>
          <span className="block font-semibold">YouTube Resource Weights</span>
          {topic.resourceWeights.map((rw, i) => (
            <input
              key={i}
              type="number"
              step="0.01"
              className="border p-2 w-full mb-1"
              placeholder={`Resource ${i + 1}`}
              value={rw}
              onChange={(e) => updateResourceWeight(idx, i, e.target.value)}
            />
          ))}
        </div>
      ))}

      <button
        type="button"
        onClick={addTopic}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Topic
      </button>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
}
