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

export async function getLearningPlansByUser(userId) {
  try {
    const response = await fetch(`${BASE_URL}?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch learning plans');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching learning plans:', error);
    throw error;
  }
}

export async function getLearningPlanById(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch learning plan by ID');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching learning plan by ID:', error);
    throw error;
  }
}

export async function updateLearningPlanDueDate(planId, dueDateIsoString) {
  try {
    const response = await fetch(`${BASE_URL}/${planId}/due-date`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dueDate: dueDateIsoString }), // <-- Corrected
    });

    if (!response.ok) {
      throw new Error('Failed to update due date');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating due date:', error);
    throw error;
  }
}