// src/components/PostActions.jsx
import React, { useState } from 'react';
import { Heart } from 'lucide-react';

export default function PostActions({ postId, likeCount, onLikeToggle }) {
  const [loading, setLoading] = useState(false);
  const userId = sessionStorage.getItem('facebookId');
  const token  = sessionStorage.getItem('jwtToken');

  const toggleLike = () => {
    setLoading(true);
    fetch(`http://localhost:8080/api/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined
      },
      body: JSON.stringify({ userId })
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(onLikeToggle)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition focus:outline-none"
      aria-label="Like post"
    >
      <Heart className={`h-5 w-5 ${likeCount > 0 ? 'fill-red-500 text-red-600' : ''}`} />
      <span>{likeCount}</span>
    </button>
  );
}