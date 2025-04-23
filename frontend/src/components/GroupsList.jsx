import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function GroupsList() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    fetch('http://localhost:8080/api/groups', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not OK');
        return res.json();
      })
      .then((data) => {
        setGroups(data);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load community groups.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading groups…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <Link
          key={group.id}
          to={`/groups/${group.id}`}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 flex flex-col"
        >
          <h3 className="text-xl font-semibold text-indigo-600">{group.name}</h3>
          <p className="text-gray-600 mt-2 flex-grow line-clamp-3">
            {group.description}
          </p>
          <div className="mt-4 flex justify-between text-sm text-gray-500">
            <span>{group.members.length} member{group.members.length !== 1 && 's'}</span>
            <span>By {group.createdBy}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}