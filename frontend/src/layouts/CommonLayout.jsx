// src/layouts/CommonLayout.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import LeftPanel from '../components/LeftPanel';
import RightPanel from '../components/RightPanel';

export default function CommonLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-50 text-gray-800">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel />
        <main className="flex-1 p-6 overflow-y-auto bg-white rounded-lg shadow-md m-4">
          {children}
        </main>
        <RightPanel />
      </div>
    </div>
  );
}