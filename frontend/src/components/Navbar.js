import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        if (parsedUser.name) {
          setUsername(parsedUser.name);
        }
      } catch (err) {
        console.error("Failed to parse user from session storage", err);
      }
    }
  }, []);

  return (
    <div className="navbar-container">
      {/* Left - Logo */}
      <div className="logo">
        <h1>UpSkill</h1>
      </div>

      {/* Center - Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          className="input-search-bar"
          placeholder="Search skills, posts..."
        />
      </div>

      {/* Right - Profile & Notifications */}
      <div className="profile-section">
        <FaBell className="icon" />
        <div className="user-info">
          <span>{username}</span>
          <img src="/profile.png" alt="Profile" className="profile-image" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;