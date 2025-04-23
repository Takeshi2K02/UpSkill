import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, FileText, Edit2, Trash2, Menu, Users, Layers } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const facebookId = sessionStorage.getItem('facebookId');
  const fbToken = sessionStorage.getItem('facebookAccessToken');
  const profilePicUrl =
    facebookId && fbToken
      ? `https://graph.facebook.com/${facebookId}/picture?width=48&height=48&access_token=${fbToken}`
      : null;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100">

      {/* Header / Navbar */}
      <header className="bg-white/80 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Menu className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-indigo-700">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Good Afternoon, <span className="font-semibold text-indigo-700">{user?.name || 'Admin'}</span>
            </span>
            {profilePicUrl && (
              <img
                src={profilePicUrl}
                alt="User avatar"
                className="h-10 w-10 rounded-full border-2 border-indigo-200"
              />
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 flex items-center space-x-6 shadow-xl">
          <Users className="h-12 w-12 text-indigo-600" />
          <div>
            <h3 className="text-xl font-bold text-indigo-700">120 Members</h3>
            <p className="text-gray-500">Active in community</p>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 flex items-center space-x-6 shadow-xl">
          <Layers className="h-12 w-12 text-green-600" />
          <div>
            <h3 className="text-xl font-bold text-green-700">4 Groups</h3>
            <p className="text-gray-500">Currently managed</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Create Group Card */}
          <section className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-3xl transition transform hover:-translate-y-1 p-8 flex flex-col">
            <div className="flex items-center mb-6">
              <PlusCircle className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-semibold text-indigo-700">Create New Group</h2>
            </div>
            <p className="text-gray-600 mb-8 flex-grow">
              Start a new community group for users to share their skills and knowledge.
            </p>
            <Link
              to="/groups/create"
              className="mt-auto inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Create Group
            </Link>
          </section>

          {/* Manage Groups Card */}
          <section className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-3xl transition transform hover:-translate-y-1 p-8 flex flex-col">
            <div className="flex items-center mb-6">
              <FileText className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-semibold text-green-700">Manage Groups</h2>
            </div>
            <p className="text-gray-600 mb-8 flex-grow">
              View, edit, or delete your community groups easily.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-auto">
              <Link
                to="/groups"
                className="inline-flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <FileText className="h-5 w-5 mr-2" />
                View All
              </Link>
              <Link
                to="/groups"
                className="inline-flex items-center justify-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300"
              >
                <Edit2 className="h-5 w-5 mr-2" />
                Edit Groups
              </Link>
              <Link
                to="/groups"
                className="inline-flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Delete Groups
              </Link>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/70 backdrop-blur-lg border-t py-4">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SkillUp. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
