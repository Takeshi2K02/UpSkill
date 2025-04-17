export const normalizeWeights = (topics) => {
    const total = topics.reduce((sum, t) => sum + (t.weight || 0), 0);
  
    return topics.map((t) => ({
      name: t.name,
      textContent: t.textContent,
      resources: t.resources,
      weight: total > 0
        ? parseFloat(((t.weight || 0) / total).toFixed(3))
        : 0,
    }));
  };
  