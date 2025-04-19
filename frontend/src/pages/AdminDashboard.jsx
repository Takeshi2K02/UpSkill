import React from 'react';

export default function AdminDashboard() {
  const name = sessionStorage.getItem('name') || 'Admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-200 p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Top Welcome Section */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-indigo-700 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Hello, <span className="font-bold">{name}</span>! Manage the community efficiently and easily.</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">Create New Group</h2>
            <p className="text-gray-500 mb-6">Start a new community group for users to share their skills and knowledge.</p>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition">
              ➕ Create Group
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Manage Existing Groups</h2>
            <p className="text-gray-500 mb-6">Edit, view, or delete existing community groups easily.</p>
            <div className="space-y-3">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition">
                📋 View Groups
              </button>
              <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded-lg transition">
                ✏️ Edit Groups
              </button>
              <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition">
                🗑️ Delete Groups
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}