// src/services/groupService.js

// Use the same VITE_BASE_URL you have for learningPlanService.js
const API_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

/**
 * Fetch all community groups
 */
export async function getAllGroups() {
  const res = await fetch(`${API_BASE}/api/groups`);
  if (!res.ok) throw new Error(`Error fetching groups: ${res.statusText}`);
  return res.json();
}

/**
 * Fetch groups created by a specific admin
 * @param {string} adminId
 */
export async function getGroupsByAdmin(adminId) {
  const res = await fetch(`${API_BASE}/api/groups/admin/${adminId}`);
  if (!res.ok) throw new Error(`Error fetching admin groups: ${res.statusText}`);
  return res.json();
}

/**
 * Fetch groups a user is a member of
 * @param {string} userId
 */
export async function getGroupsByUser(userId) {
  const res = await fetch(`${API_BASE}/api/groups/user/${userId}`);
  if (!res.ok) throw new Error(`Error fetching user groups: ${res.statusText}`);
  return res.json();
}

/**
 * Fetch a single group by its ID
 * @param {string} groupId
 */
export async function getGroupById(groupId) {
  const res = await fetch(`${API_BASE}/api/groups/${groupId}`);
  if (!res.ok) throw new Error(`Error fetching group: ${res.statusText}`);
  return res.json();
}

/**
 * Create a new community group
 * @param {object} groupData
 */
export async function createGroup(groupData) {
  const res = await fetch(`${API_BASE}/api/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(groupData),
  });
  if (!res.ok) throw new Error(`Error creating group: ${res.statusText}`);
  return res.json();
}

/**
 * Update an existing community group
 * @param {string} groupId
 * @param {object} updatedData
 */
export async function updateGroup(groupId, updatedData) {
  const res = await fetch(`${API_BASE}/api/groups/${groupId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) throw new Error(`Error updating group: ${res.statusText}`);
  return res.json();
}

/**
 * Delete a community group
 * @param {string} groupId
 */
export async function deleteGroup(groupId) {
  const res = await fetch(`${API_BASE}/api/groups/${groupId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Error deleting group: ${res.statusText}`);
}

/**
 * Join a community group
 * @param {string} groupId
 * @param {string} userId
 */
export async function joinGroup(groupId, userId) {
  const res = await fetch(`${API_BASE}/api/groups/${groupId}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error(`Error joining group: ${res.statusText}`);
  return res.json();
}

/**
 * Leave a community group
 * @param {string} groupId
 * @param {string} userId
 */
export async function leaveGroup(groupId, userId) {
  const res = await fetch(`${API_BASE}/api/groups/${groupId}/leave`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error(`Error leaving group: ${res.statusText}`);
  return res.json();
}