// src/components/RightPanel.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RightPanel() {
  const [users, setUsers] = useState([]);
  const accessToken = sessionStorage.getItem('facebookAccessToken');

  useEffect(() => {
    axios.get('http://localhost:8080/api/users')
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch users:', err);
      });
  }, []);

  return (
    <aside className="w-72 hidden xl:flex flex-col space-y-4 p-4">
      {/* Progress Summary */}
      <div className="bg-white rounded-lg shadow">
        <h3 className="text-sm font-semibold text-gray-700 px-4 pt-4 pb-2">Progress</h3>
        <div className="p-4 pt-0">
          <ul className="space-y-3 text-sm">
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

      {/* Community Groups – scrollable with fixed height */}
      <div className="bg-white rounded-lg shadow max-h-64 overflow-hidden relative flex flex-col pb-4">
        <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-2">
          <h3 className="text-sm font-semibold text-gray-700">Groups</h3>
        </div>
        <div className="flex-1 px-4 pt-0 overflow-hidden hover:overflow-y-auto scrollbar-hide">
          <ul className="space-y-2 text-blue-700 text-sm font-medium">
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


      {/* Suggested Users – scrollable with live data + profile pictures */}
      <div className="bg-white rounded-lg shadow max-h-64 overflow-hidden relative flex flex-col pb-4">
        {/* Sticky Title */}
        <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-2">
          <h3 className="text-sm font-semibold text-gray-700">Suggestions</h3>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 px-4 pt-0 overflow-hidden hover:overflow-y-auto scrollbar-hide">
          <ul className="space-y-3 text-sm">
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
    </aside>
  );
}
