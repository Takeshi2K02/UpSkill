// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const facebookId = sessionStorage.getItem('facebookId');
  const fbToken = sessionStorage.getItem('facebookAccessToken');
  const profilePicUrl =
    facebookId && fbToken
      ? `https://graph.facebook.com/${facebookId}/picture?width=48&height=48&access_token=${fbToken}`
      : null;

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
            placeholder="Search skills or posts..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-400 transition"
          />
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-4 z-10">
        <Bell className="w-6 h-6 text-gray-600 hover:text-blue-600" />
        {profilePicUrl && (
          <img
            src={profilePicUrl}
            alt="Profile"
            className="w-10 h-10 rounded-full border shadow-sm"
          />
        )}
        <span className="font-medium text-gray-800">{user?.name || 'User'}</span>
      </div>
    </nav>
  );
}