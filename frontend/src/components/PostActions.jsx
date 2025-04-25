import React, { useState } from 'react';

export default function PostActions({ postId, likeCount, onLikeToggle }) {
  const [loading, setLoading] = useState(false);
  const userId = sessionStorage.getItem('facebookId');
  const token  = sessionStorage.getItem('jwtToken');

  const handleToggle = () => {
    setLoading(true);
    fetch(`http://localhost:8080/api/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      body: JSON.stringify({ userId }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Like toggle failed');
        return res.json();
      })
      .then(() => {
        if (onLikeToggle) onLikeToggle();
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 9l3 3-3 3m-4 0l-3-3 3-3"
        />
      </svg>
      <span>{likeCount}</span>
    </button>
  );
}