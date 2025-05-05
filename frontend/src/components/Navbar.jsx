// src/components/Navbar.jsx
import React, { useContext, useState, useEffect, use } from "react";
import { AuthContext } from "../context/AuthContext";
import { Bell, Search } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = React.useRef(null);
  const navigate = useNavigate();

  const facebookId = sessionStorage.getItem("facebookId");
  const fbToken = sessionStorage.getItem("facebookAccessToken");
  const profilePicUrl =
    facebookId && fbToken
      ? `https://graph.facebook.com/${facebookId}/picture?width=48&height=48&access_token=${fbToken}`
      : null;

      // Fetch notifications for the logged-in user
      useEffect(() => {
        const fetchNotifications = async () => {
          if (user?.id) {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/notifications?userId=${user.id}`
              );
              setNotifications(response.data);
            } catch (error) {
              console.error("Error fetching notifications:", error);
            }
          }
        };

        fetchNotifications();
      }, [user?.id]);

      useEffect(() => {
        const handleClickOutside = (event) => { 
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowNotifications(false);
          }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [dropdownRef]);


  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length > 0) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/users/search?query=${searchQuery}`
          );
          setSearchResults(response.data);
          setShowResults(true);
        } catch (error) {
          console.error("Error searching users:", error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    };

    const timer = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    setSearchQuery("");
    setShowResults(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const getProfilePicUrl = (userId, userName) => {
    if (userId === user?.id) {
      const facebookId = sessionStorage.getItem("facebookId");
      const fbToken = sessionStorage.getItem("facebookAccessToken");
      if (facebookId && fbToken) {
        return `https://graph.facebook.com/${facebookId}/picture?width=200&height=200&access_token=${fbToken}`;
      }
    } else {
      const fbToken = sessionStorage.getItem("facebookAccessToken");
      if (fbToken) {
        return `https://graph.facebook.com/${userId}/picture?width=200&height=200&access_token=${fbToken}`;
      }
    }

    const nameForAvatar = userName || `User ${userId.slice(0, 5)}`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      nameForAvatar
    )}&background=random&length=2`;
  };

  

  return (
    <nav className="relative w-full bg-white shadow-lg px-6 py-4 flex items-center justify-between">
      {/* App Name */}
      <h1 className="text-2xl font-bold text-blue-700 z-10">UpSkill 🛡️</h1>

      {/* Modern Centered Search Bar */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-xl">
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-400 transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => handleUserClick(user.id)}
                >
                  <img
                    src={
                      getProfilePicUrl(user.id, user.name) ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name
                      )}&background=random&length=2`
                    }
                    alt={user.name}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">
                      {user.bio || "No bio"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-4 z-10 relative">
        {/* Bell Icon */}
        <div className="relative">
        <Bell className="w-6 h-6 text-gray-600 hover:text-blue-600 cursor-pointer"
        onClick={toggleNotifications} 
        />
        {notifications.filter((notification) => !notification.isRead).length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1">
            {notifications.filter((notification) => !notification.isRead).length}
          </span>
        )}
        </div>
        {/* Notifications Dropdown */}
        {showNotifications && (
          <div 
          ref = {dropdownRef}
          className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50"
          >
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-2 text-sm ${
                    notification.isRead ? "text-gray-500" : "text-gray-700"
                  } hover:bg-gray-100`}
                >
                  <span className="font-semibold">{notification.actionBy}</span>{" "}
                  {notification.actionType} your post{" "}
                  </div>
                  )) 
                   
            ) : (
              <div className="p-3 text-center text-gray-500">No new notifications</div>
            )}
          </div>
        )}

        {/* Profile Picture */}

        {profilePicUrl && (
          <img
            src={profilePicUrl}
            alt="Profile"
            className="w-10 h-10 rounded-full border shadow-sm"
            onClick={() => navigate(`/profile/${facebookId}`)}
          />
        )}
        <span className="font-medium text-gray-800">
          {user?.name || "User"}
        </span>
      </div>
    </nav>
  );
}
