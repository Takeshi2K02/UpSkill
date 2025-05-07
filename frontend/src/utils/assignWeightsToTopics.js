import { getVideoDurationsInMinutes } from '../services/youtubeService';

export async function assignWeightsToTopics(topics) {
  const topicDurations = [];

  // Step 1: Calculate raw durations per topic
  for (const topic of topics) {
    const readingTime = estimateReadingTimeInMinutes(topic.textContent || '');
    const videoUrls = (topic.resources || []).map(r => r.url);
    const videoDurations = await getVideoDurationsInMinutes(videoUrls);

    const totalTopicMinutes = readingTime + videoDurations.reduce((a, b) => a + b, 0);
    topicDurations.push({ topic, readingTime, videoDurations, totalMinutes: totalTopicMinutes });
  }

  const totalPlanMinutes = topicDurations.reduce((sum, t) => sum + t.totalMinutes, 0);

  // Step 2: Assign scaled weights
  return topicDurations.map(({ topic, readingTime, videoDurations, totalMinutes }) => {
    const topicWeight = totalMinutes / totalPlanMinutes;

    const textProportion = readingTime / totalMinutes;
    const textWeight = topicWeight * textProportion;

    const resourceWeights = videoDurations.map(
      dur => (dur / totalMinutes) * topicWeight
    );

    const resources = (topic.resources || []).map((res, idx) => ({
      ...res,
      weight: resourceWeights[idx]
    }));

    return {
      ...topic,
      weight: topicWeight,
      textWeight,
      resources,
      textCompleted: false,
      resourceCompletion: resources.map(() => false),
      status: 'incomplete'
    };
  });
}

function estimateReadingTimeInMinutes(text) {
  const words = text.trim().split(/\s+/).length;
  return words / 200;
}
