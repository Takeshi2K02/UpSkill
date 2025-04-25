import React, { useState } from 'react';

export default function CommentsSection({ postId, comments, onNewComment }) {
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const userId = sessionStorage.getItem('facebookId');
  const token  = sessionStorage.getItem('jwtToken');

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);

    fetch(`http://localhost:8080/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      body: JSON.stringify({ userId, content: newComment }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Comment failed');
        return res.json();
      })
      .then(() => {
        setNewComment('');
        if (onNewComment) onNewComment();
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Comments</h3>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {comments.map((c, idx) => (
          <div key={idx} className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-800">{c.userName}</p>
            <p className="text-gray-700">{c.content}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(c.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-500 italic">No comments yet.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          required
          disabled={loading}
          className="flex-grow border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg transition ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Posting…' : 'Comment'}
        </button>
      </form>
    </div>
  );
}