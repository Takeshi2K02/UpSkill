// src/components/Navbar.jsx

import React, { useContext, useState, useEffect } from "react";

import { AuthContext } from "../context/AuthContext";

import { Bell, Search } from "lucide-react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import NotificationPanel from "./NotificationPanel";



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



  useEffect(() => {

    const fetchNotifications = async () => {

      if (user?.id) {

        try {

          const response = await axios.get(

            `http://localhost:8080/api/notifications/user/${user.id}`

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

      <h1 className="text-2xl font-bold text-blue-700 z-10">UpSkill 🛡️</h1>



      <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-xl z-10">

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

          {showResults && searchResults.length > 0 && (

            <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto">

              {searchResults.map((user) => (

                <div

                  key={user.id}

                  className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"

                  onClick={() => handleUserClick(user.id)}

                >

                  <img

                    src={getProfilePicUrl(user.id, user.name)}

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



      <div className="flex items-center gap-4 relative z-50">

        <div className="relative z-50" ref={dropdownRef}>

          <Bell

            className="w-6 h-6 text-gray-600 hover:text-blue-600 cursor-pointer z-50"

            onClick={toggleNotifications}

          />

          {notifications.filter((n) => !n.isRead).length > 0 && (

            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5 py-0.5 z-50">

              {notifications.filter((n) => !n.isRead).length}

            </span>

          )}

          {showNotifications && (

            <NotificationPanel

              notifications={notifications}

              setNotifications={setNotifications}

              onClose={() => setShowNotifications(false)}

            />

          )}

        </div>



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