import axios from 'axios';

export const fetchNotifications = async (userId) => {
  const res = await axios.get(`/api/notifications/user/${userId}`);
  return res.data;
};

export const markNotificationAsRead = async (notificationId) => {
  await axios.put(`/api/notifications/${notificationId}/read`);
};