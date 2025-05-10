import React from "react";

import axios from "axios";



export default function NotificationPanel({ notifications, setNotifications, onClose }) {

  const markAsRead = async (notificationId) => {

    try {

      await axios.put(`http://localhost:8080/api/notifications/${notificationId}/read`);

      setNotifications((prev) =>

        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))

      );

    } catch (err) {

      console.error("Failed to mark notification as read", err);

    }

  };



  return (

    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">

      {notifications.length > 0 ? (

        notifications.map((n) => (

          <div

            key={n.id}

            className={`px-4 py-2 text-sm cursor-pointer ${

              n.isRead ? "text-gray-500" : "text-gray-800 font-medium"

            } hover:bg-gray-100`}

            onClick={(e) => {

              e.stopPropagation();

              markAsRead(n.id);

            }}

          >

            {n.message}

          </div>

        ))

      ) : (

        <div className="p-3 text-center text-gray-500">No new notifications</div>

      )}

    </div>

  );

}