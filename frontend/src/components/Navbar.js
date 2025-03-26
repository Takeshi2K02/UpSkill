import React from "react";
import { FaBell } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
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
          <span>David Jonson</span>
          <img src="/profile.png" alt="Profile" className="profile-image" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
