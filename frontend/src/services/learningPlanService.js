const BASE_URL = import.meta.env.VITE_BASE_URL + '/api/learning-plans';

export async function createLearningPlan(learningPlan) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(learningPlan),
    });

    if (!response.ok) {
      throw new Error('Failed to create learning plan');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating learning plan:', error);
    throw error;
  }
}