const YOUTUBE_API_KEY = 'AIzaSyAVf_zhFiLkiqNsCFYkE_CXwr8-sfTn7p4';
const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';

export async function fetchYouTubeVideos(query, maxResults = 5) {
  try {
    // Step 1: Search for video IDs based on query
    const searchRes = await fetch(
      `${SEARCH_URL}?part=snippet&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}&type=video&maxResults=${maxResults}`
    );

    const searchData = await searchRes.json();
    const videoIds = searchData.items?.map((item) => item.id.videoId).join(',');

    if (!videoIds) return [];

    // Step 2: Get video details including duration
    const detailsRes = await fetch(
      `${VIDEOS_URL}?part=snippet,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );

    const detailsData = await detailsRes.json();

    return detailsData.items.map((video) => {
      return {
        url: `https://www.youtube.com/watch?v=${video.id}`,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.medium.url,
        duration: parseDuration(video.contentDetails.duration), // Optional for topic weight
      };
    });
  } catch (error) {
    console.error('YouTube API error:', error);
    return [];
  }
}

function parseDuration(isoDuration) {
  // Example: PT10M45S or PT1H2M30S
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const [, hours = 0, minutes = 0, seconds = 0] = match.map((val) => parseInt(val || 0, 10));
  return hours * 3600 + minutes * 60 + seconds; // return in seconds
}