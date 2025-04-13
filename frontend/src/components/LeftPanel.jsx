// src/components/LeftPanel.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, User, Book, MessageCircle, Users, LogOut } from 'lucide-react';

export default function LeftPanel() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <aside className="w-64 hidden md:block h-full sticky top-0 p-4">
      <div className="bg-white rounded-lg shadow p-4 pt-4 flex flex-col justify-between h-full">
        <nav className="space-y-4">
          <NavLink to="/" className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-50 transition">
            <Home size={18} /> Home
          </NavLink>
          <NavLink to="/profile" className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-50 transition">
            <User size={18} /> Profile
          </NavLink>
          <NavLink to="/learning-plans" className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-50 transition">
            <Book size={18} /> Plans
          </NavLink>
          <NavLink to="/chatbot" className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-50 transition">
            <MessageCircle size={18} /> Chatbot
          </NavLink>
          <NavLink to="/community" className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-50 transition">
            <Users size={18} /> Community
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 px-3 py-2 rounded hover:bg-red-50 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
