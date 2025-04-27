// src/pages/AdminDashboard.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, FileText, Users, Layers } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import CommonLayout from '../layouts/CommonLayout';

export default function AdminDashboard() {
  const { user }   = useContext(AuthContext);
  const facebookId = sessionStorage.getItem('facebookId');
  const fbToken    = sessionStorage.getItem('facebookAccessToken');
  const profilePicUrl =
    facebookId && fbToken
      ? `https://graph.facebook.com/${facebookId}/picture?width=48&height=48&access_token=${fbToken}`
      : null;

  return (
    <CommonLayout>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 flex items-center space-x-6 shadow-lg">
          <Users className="h-12 w-12 text-indigo-600" />
          <div>
            <h3 className="text-xl font-bold text-indigo-700">120 Members</h3>
            <p className="text-gray-500">Active in community</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 flex items-center space-x-6 shadow-lg">
          <Layers className="h-12 w-12 text-green-600" />
          <div>
            <h3 className="text-xl font-bold text-green-700">4 Groups</h3>
            <p className="text-gray-500">Currently managed</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Group Card */}
        <section className="bg-white rounded-2xl p-8 flex flex-col shadow-lg">
          <div className="flex items-center mb-6">
            <PlusCircle className="h-8 w-8 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-semibold text-indigo-700">Create New Group</h2>
          </div>
          <p className="text-gray-600 mb-8 flex-grow">
            Start a new community group for users to share their skills and knowledge.
          </p>
          <Link
            to="/groups/create"
            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Create Group
          </Link>
        </section>

        {/* Manage Groups Card */}
        <section className="bg-white rounded-2xl p-8 flex flex-col shadow-lg">
          <div className="flex items-center mb-6">
            <FileText className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-semibold text-green-700">Manage Groups</h2>
          </div>
          <p className="text-gray-600 mb-8 flex-grow">
            View and manage your community groups.
          </p>
          <Link
            to="/groups"
            className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <FileText className="h-5 w-5 mr-2" />
            View All
          </Link>
        </section>
      </main>
    </CommonLayout>
  );
}