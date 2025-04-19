import React, { useEffect, useState } from 'react';
import { getLearningPlansByUser } from '../services/learningPlanService'; // <-- import service

export default function RightPanel() {
  const [users, setUsers] = useState([]);
  const [currentPlans, setCurrentPlans] = useState([]);
  const accessToken = sessionStorage.getItem('facebookAccessToken');
  const userId = sessionStorage.getItem('facebookId');

  useEffect(() => {
    async function fetchCurrentPlans() {
      try {
        const allPlans = await getLearningPlansByUser(userId);

        const calculateProgress = (plan) => {
          if (!plan || !plan.topics || plan.topics.length === 0) return 0;
          let totalWeight = 0;
          let completedWeight = 0;
          for (const topic of plan.topics) {
            const weight = topic.weight || 0;
            totalWeight += weight;
            if (topic.status === 'completed') {
              completedWeight += weight;
            }
          }
          if (totalWeight === 0) return 0;
          return Math.round((completedWeight / totalWeight) * 100);
        };

        const filtered = allPlans.filter(plan => {
          const progress = calculateProgress(plan);
          return plan.dueDate && progress < 100;
        });

        setCurrentPlans(filtered);
      } catch (error) {
        console.error('Failed to fetch learning plans:', error);
      }
    }

    fetchCurrentPlans();
  }, [userId]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('http://localhost:8080/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <aside className="w-72 hidden xl:flex flex-col h-full sticky top-0 p-4 box-border">
      <div className="grid grid-rows-3 gap-4 h-full">

        {/* === Progress === */}
        <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Progress</h3>
          <div className="flex-1 overflow-hidden hover:overflow-y-auto scrollbar-hide">
            <ul className="space-y-3 text-sm pb-2">
              {currentPlans.map(plan => {
                const progress = (function() {
                  if (!plan.topics || plan.topics.length === 0) return 0;
                  let totalWeight = 0;
                  let completedWeight = 0;
                  for (const topic of plan.topics) {
                    const weight = topic.weight || 0;
                    totalWeight += weight;
                    if (topic.status === 'completed') {
                      completedWeight += weight;
                    }
                  }
                  if (totalWeight === 0) return 0;
                  return Math.round((completedWeight / totalWeight) * 100);
                })();

                return (
                  <li key={plan._id?.$oid || plan.id}>
                    <span className="block font-medium truncate w-full" title={plan.title}>
                      {plan.title}
                    </span>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }} />
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

        {/* === Groups === */}
        <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Groups</h3>
          <div className="flex-1 overflow-hidden hover:overflow-y-auto scrollbar-hide">
            <ul className="space-y-2 text-blue-700 text-sm font-medium pb-2">
              <li>Python Basic</li>
              <li>React Fundamentals</li>
              <li>Agentic AI</li>
              <li>Gen AI</li>
              <li>AI Agents</li>
              <li>Prompt Engineering</li>
              <li>Vector DBs</li>
              <li>LangChain</li>
              <li>RAG Systems</li>
            </ul>
          </div>
        </div>

        {/* === Suggestions === */}
        <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Suggestions</h3>
          <div className="flex-1 overflow-hidden hover:overflow-y-auto scrollbar-hide">
            <ul className="space-y-3 text-sm pb-2">
              {users.map((user) => {
                const profilePicUrl = `https://graph.facebook.com/${user.id}/picture?width=48&height=48&access_token=${accessToken}`;
                return (
                  <li key={user.id} className="flex items-center gap-3 text-gray-800">
                    <img
                      src={profilePicUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border"
                    />
                    <span>{user.name}</span>
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