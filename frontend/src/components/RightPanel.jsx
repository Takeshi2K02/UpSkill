// src/components/RightPanel.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RightPanel() {
  const [users, setUsers] = useState([]);
  const accessToken = sessionStorage.getItem('facebookAccessToken');

  useEffect(() => {
    axios.get('http://localhost:8080/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Failed to fetch users:', err));
  }, []);

  return (
    <aside className="w-72 hidden xl:flex flex-col h-full sticky top-0 p-4 box-border">
      <div className="grid grid-rows-3 gap-4 h-full">

        {/* === Progress === */}
        <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Progress</h3>
          <div className="flex-1 overflow-hidden hover:overflow-y-auto scrollbar-hide">
            <ul className="space-y-3 text-sm pb-2">
              <li>
                <span className="block font-medium">Python Basics</span>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }} />
                </div>
              </li>
              <li>
                <span className="block font-medium">React Fundamentals</span>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }} />
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* === Groups === */}
        <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Groups</h3>
          <div className="flex-1 overflow-hidden hover:overflow-y-auto scrollbar-hide">
            <ul className="space-y-2 text-blue-700 text-sm font-medium pb-2">
              <li>Python Basic</li>
              <li>React Fundamentals</li>
              <li>Agentic AI</li>
              <li>Gen AI</li>
              <li>AI Agents</li>
              <li>Prompt Engineering</li>
              <li>Vector DBs</li>
              <li>LangChain</li>
              <li>RAG Systems</li>
            </ul>
          </div>
        </div>

        {/* === Suggestions === */}
        <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Suggestions</h3>
          <div className="flex-1 overflow-hidden hover:overflow-y-auto scrollbar-hide">
            <ul className="space-y-3 text-sm pb-2">
              {users.map((user) => {
                const profilePicUrl = `https://graph.facebook.com/${user.id}/picture?width=48&height=48&access_token=${accessToken}`;
                return (
                  <li key={user.id} className="flex items-center gap-3 text-gray-800">
                    <img
                      src={profilePicUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border"
                    />
                    <span>{user.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

      </div>
    </aside>
  );
}