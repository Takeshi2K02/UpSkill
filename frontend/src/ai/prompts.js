export const generatePlanTitlePrompt = `
You are helping users create high-quality learning plans on a skill-sharing platform.

Generate 5 concise, engaging, and goal-oriented learning plan titles.
Each title should:
- Be suitable for a broad audience
- Clearly convey the skill or goal to be achieved
- Use natural language (avoid technical jargon unless appropriate)

Format: list each title on a new line without numbers, bullets or any special characters.
Output only the titles.
`;


export const generateDescriptionPrompt = (title) => `
You are assisting a user in writing a clear and inspiring description for their learning plan.

Title: "${title}"

Write a medium, engaging description (4–5 sentences max) that:
- Explains the purpose and outcome of the plan
- Motivates the learner to begin
- Avoids technical jargon unless the title suggests an advanced topic

Respond with just the description, no labels or formatting.
`;

export const generateTopicSuggestionsPrompt = (title, description) => `
Suggest 5 relevant topic names for a learning plan titled "${title}".
The goal of this plan is: ${description}.
Each topic should be one short phrase and represent a building block toward the goal.
List them line-by-line, without numbering.
`;

export const generateTopicContentPrompt = (topic, title) => `
Write an educational explanation for the topic "${topic}" within the context of the learning plan "${title}".
Keep it concise, beginner-friendly, and structured. Use bullet points or short paragraphs where helpful.
`;

export const generateYouTubeSearchQueryPrompt = (topic) => `
Generate a YouTube search query to help a learner find videos related to: "${topic}".
Keep it short, clear, and optimized for YouTube search.
Return just the query string.
`;