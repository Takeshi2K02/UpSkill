import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      {/* Search Bar */}
      <input type="text" className="search-bar" placeholder="Search skills, posts..." />

      {/* Right Section */}
      <div className="navbar-right">
        <FaBell className="icon" />
        <FaUserCircle className="profile-icon" />
      </div>
    </div>
  );
};

export default Navbar;