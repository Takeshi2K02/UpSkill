// src/pages/GroupDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function GroupDetail() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const userId = sessionStorage.getItem('facebookId');
  const role   = sessionStorage.getItem('role');
  const token  = sessionStorage.getItem('jwtToken');

  useEffect(() => {
    fetch(`http://localhost:8080/api/groups/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load group');
        return res.json();
      })
      .then(data => setGroup(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) return <p className="p-6 text-gray-600">Loading group…</p>;
  if (error)   return <p className="p-6 text-red-600">{error}</p>;

  // Determine admin vs member
  const isAdmin  = role === 'ADMIN' && group.createdBy === userId;
  const isMember = group.members.includes(userId);

  const handleMembership = (action) => {
    setActionLoading(true);
    fetch(`http://localhost:8080/api/groups/${id}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      body: JSON.stringify({ userId }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Action failed');
        return res.json();
      })
      .then(updated => setGroup(updated))
      .catch(err => setError(err.message))
      .finally(() => setActionLoading(false));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-indigo-700 mb-2">{group.name}</h1>
      <p className="text-gray-700 mb-4">{group.description}</p>
      <p className="text-sm text-gray-500 mb-6">
        Created by <span className="font-medium">{group.createdBy}</span> ·{' '}
        {group.members.length} member{group.members.length !== 1 && 's'}
      </p>

      {isAdmin ? (
        <Link
          to={`/groups/edit/${group.id}`}
          className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition"
        >
          Edit Group
        </Link>
      ) : (
        <button
          onClick={() => handleMembership(isMember ? 'leave' : 'join')}
          disabled={actionLoading}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            isMember
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {actionLoading
            ? isMember ? 'Leaving…' : 'Joining…'
            : isMember ? 'Leave Group' : 'Join Group'}
        </button>
      )}

      <div className="mt-8 text-gray-500 italic">
        Posts and discussions will appear here.
      </div>
    </div>
  );
}