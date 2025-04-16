export function calculateTopicWeight(textContent = '', videos = []) {
    const wordCount = textContent.trim().split(/\s+/).length;
    const videoSeconds = videos.reduce((total, v) => total + (v.duration || 0), 0);
  
    const textWeight = wordCount / 100;
    const videoWeight = videoSeconds / 60;
  
    return parseFloat((textWeight + videoWeight).toFixed(2));
  }