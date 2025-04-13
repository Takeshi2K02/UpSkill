// src/layouts/CommonLayout.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import LeftPanel from '../components/LeftPanel';
import RightPanel from '../components/RightPanel';

export default function CommonLayout({ children }) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel />
        <main className="flex-1 p-6 overflow-y-auto bg-white">
          {children}
        </main>
        <RightPanel />
      </div>
    </div>
  );
}
