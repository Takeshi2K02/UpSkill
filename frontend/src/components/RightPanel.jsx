import React, { useEffect, useState } from 'react';
import { getLearningPlansByUser } from '../services/learningPlanService';

export default function RightPanel() {
  const role        = sessionStorage.getItem('role');
  const accessToken = sessionStorage.getItem('facebookAccessToken');
  const userId      = sessionStorage.getItem('facebookId');

  // Static list of community group names
  const groups = [
    'Python Basic',
    'React Fundamentals',
    'Agentic AI',
    'Gen AI',
    'AI Agents',
    'Prompt Engineering',
    'Vector DBs',
    'LangChain',
    'RAG Systems'
  ];

  // ADMIN only: show community list
  if (role === 'ADMIN') {
    return (
      <aside className="w-72 hidden xl:flex flex-col h-full sticky top-0 p-4 box-border">
        <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Groups</h3>
          <ul className="space-y-2 text-blue-700 text-sm font-medium">
            {groups.map(name => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </aside>
    );
  }

  // USER: original three-panel layout
  const [currentPlans, setCurrentPlans] = useState([]);
  const [users, setUsers]               = useState([]);

  useEffect(() => {
    async function fetchCurrentPlans() {
      try {
        const allPlans = await getLearningPlansByUser(userId);
        const filtered = allPlans.filter(plan => {
          const topics      = plan.topics || [];
          const totalWeight = topics.reduce((s,t) => s + (t.weight||0),0);
          const doneWeight  = topics.filter(t => t.status==='completed')
                                    .reduce((s,t) => s + (t.weight||0),0);
          const pct         = totalWeight ? Math.round(doneWeight/totalWeight*100) : 0;
          return plan.dueDate && pct < 100;
        });
        setCurrentPlans(filtered);
      } catch (e) {
        console.error('Failed to fetch plans:', e);
      }
    }
    fetchCurrentPlans();
  }, [userId]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('http://localhost:8080/api/users');
        const data = await res.json();
        setUsers(data);
      } catch (e) {
        console.error('Failed to fetch users:', e);
      }
    }
    fetchUsers();
  }, []);

  return (
    <aside className="w-72 hidden xl:flex flex-col h-full sticky top-0 p-4 box-border">
      <div className="grid grid-rows-3 gap-4 h-full">

        {/* Progress */}
        <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Progress</h3>
          <div className="flex-1 overflow-hidden hover:overflow-y-auto scrollbar-hide">
            <ul className="space-y-3 text-sm pb-2">
              {currentPlans.map(plan => {
                const topics      = plan.topics || [];
                const totalWeight = topics.reduce((s,t) => s + (t.weight||0),0);
                const doneWeight  = topics.filter(t => t.status==='completed')
                                          .reduce((s,t) => s + (t.weight||0),0);
                const pct         = totalWeight ? Math.round(doneWeight/totalWeight*100) : 0;
                return (
                  <li key={plan.id || plan._id?.$oid}>
                    <span className="block font-medium truncate w-full" title={plan.title}>
                      {plan.title}
                    </span>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
              {currentPlans.length === 0 && (
                <li className="text-gray-400 text-sm">No active learning plans</li>
              )}
            </ul>
          </div>
        </div>

        {/* Groups */}
        <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Groups</h3>
          <div className="flex-1 overflow-hidden hover:overflow-y-auto scrollbar-hide">
            <ul className="space-y-2 text-blue-700 text-sm font-medium pb-2">
              {groups.map(name => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Suggestions</h3>
          <div className="flex-1 overflow-hidden hover:overflow-y-auto scrollbar-hide">
            <ul className="space-y-3 text-sm pb-2">
              {users.map(u => {
                const pic = `https://graph.facebook.com/${u.id}/picture?width=48&height=48&access_token=${accessToken}`;
                return (
                  <li key={u.id} className="flex items-center gap-3 text-gray-800">
                    <img src={pic} alt={u.name} className="w-8 h-8 rounded-full border" />
                    <span>{u.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

      </div>
    </aside>
  );
}