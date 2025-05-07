// src/pages/GroupsList.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, ChevronRight } from 'lucide-react';

import CommonLayout from '../layouts/CommonLayout';

export default function GroupsList() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = sessionStorage.getItem('jwtToken');

  useEffect(() => {
    // 1) fetch raw groups
    fetch('http://localhost:8080/api/groups', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load groups');
        return res.json();
      })
      .then(async data => {
        // 2) enrich each group with creatorName
        const enriched = await Promise.all(
          data.map(async grp => {
            try {
              const resp = await fetch(
                `http://localhost:8080/api/users/${grp.createdBy}`,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : undefined,
                  },
                }
              );
              if (!resp.ok) throw new Error();
              const user = await resp.json();
              return { ...grp, creatorName: user.name };
            } catch {
              return { ...grp, creatorName: 'Unknown' };
            }
          })
        );
        setGroups(enriched);
      })
      .catch(() => setError('Could not fetch community groups'))
      .finally(() => setLoading(false));
  }, [token]);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      );
    }
    if (error) {
      return <p className="text-red-600">{error}</p>;
    }
    if (groups.length === 0) {
      return <p className="text-gray-500 italic">No groups available.</p>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => {
          // subtract 1 so admin isn’t double-counted
          const memberCount = Math.max(0, group.members.length - 1);
          return (
            <Link
              key={group.id}
              to={`/groups/${group.id}`}
              className="flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition p-6"
            >
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                {group.name}
              </h3>
              <p className="text-gray-600 flex-grow line-clamp-3">
                {group.description}
              </p>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {memberCount} member{memberCount !== 1 && 's'}
                </span>
                <div className="flex items-center gap-1">
                  <span>By {group.creatorName}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }, [loading, error, groups]);

  return (
    <CommonLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-indigo-700">Community Groups</h1>
        {content}
      </div>
    </CommonLayout>
  );
}
