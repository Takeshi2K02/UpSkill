// src/components/CommentsSection.jsx
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

export default function CommentsSection({ postId, comments, onNewComment }) {
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading]       = useState(false);
  const userId = sessionStorage.getItem('facebookId');
  const token  = sessionStorage.getItem('jwtToken');

  const submit = e => {
    e.preventDefault();
    setLoading(true);
    fetch(`http://localhost:8080/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined
      },
      body: JSON.stringify({ userId, content: newComment })
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(() => {
        setNewComment('');
        onNewComment();
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center text-md font-semibold text-gray-800 gap-2">
        <MessageCircle className="h-5 w-5" />
        <span>Comments</span>
      </div>
      <div className="max-h-48 overflow-y-auto space-y-3">
        {comments.length === 0 ? (
          <p className="text-gray-500 italic">No comments yet.</p>
        ) : (
          comments.map((c, i) => (
            <div key={i} className="bg-white p-3 rounded-lg shadow-inner">
              <p className="font-medium text-gray-800">{c.userName}</p>
              <p className="text-gray-700">{c.content}</p>
              <time className="text-xs text-gray-500">
                {new Date(c.createdAt).toLocaleString()}
              </time>
            </div>
          ))
        )}
      </div>
      <form onSubmit={submit} className="flex items-center gap-2">
        <input
          type="text"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          required
          disabled={loading}
          className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold transition ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Posting…' : 'Comment'}
        </button>
      </form>
    </div>
  );
}