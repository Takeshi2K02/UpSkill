import React from 'react';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <h1 className="text-4xl font-bold text-red-700 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-600">
        You do not have permission to view this page.
      </p>
    </div>
  );
}