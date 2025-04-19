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

export async function updateTopicStatus(planId, topicIndex, newStatus) {
  try {
    const response = await fetch(`${BASE_URL}/${planId}/topics/${topicIndex}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error('Failed to update topic status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating topic status:', error);
    throw error;
  }
}

export async function updateLearningPlan(id, updatedPlan) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPlan),
    });

    if (!response.ok) {
      throw new Error('Failed to update learning plan');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating learning plan:', error);
    throw error;
  }
}

export async function deleteLearningPlan(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete learning plan');
    }

    return true;
  } catch (error) {
    console.error('Error deleting learning plan:', error);
    throw error;
  }
}