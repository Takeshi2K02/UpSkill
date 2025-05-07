const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

function extractVideoId(url) {
  const match = url.match(/(?:v=|\.be\/)([a-zA-Z0-9_-]{11})/);
  return match?.[1] || '';
}

export async function getVideoDurationsInMinutes(urls) {
  const videoIds = urls.map(extractVideoId).filter(Boolean);
  if (videoIds.length === 0) return [];

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(',')}&key=${API_KEY}`
  );

  const data = await response.json();
  return data.items.map(item => parseYouTubeDuration(item.contentDetails.duration));
}

function parseYouTubeDuration(iso) {
  const match = iso.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
  const minutes = parseInt(match?.[1] || 0, 10);
  const seconds = parseInt(match?.[2] || 0, 10);
  return minutes + seconds / 60;
}
