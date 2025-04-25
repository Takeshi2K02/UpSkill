import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostActions from '../components/PostActions';
import CommentsSection from '../components/CommentsSection';

export default function GroupDetail() {
  const { id } = useParams();

  const [group, setGroup] = useState(null);
  const [groupLoading, setGroupLoading] = useState(true);
  const [groupError, setGroupError] = useState('');

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState('');

  const [newContent, setNewContent] = useState('');
  const [newFiles, setNewFiles] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const userId = sessionStorage.getItem('facebookId');
  const role   = sessionStorage.getItem('role');
  const token  = sessionStorage.getItem('jwtToken');

  // Fetch group data
  const loadGroup = useCallback(() => {
    setGroupLoading(true);
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
      .then(setGroup)
      .catch(err => setGroupError(err.message))
      .finally(() => setGroupLoading(false));
  }, [id, token]);

  // Fetch posts in group
  const loadPosts = useCallback(() => {
    setPostsLoading(true);
    fetch(`http://localhost:8080/api/posts/groups/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load posts');
        return res.json();
      })
      .then(setPosts)
      .catch(err => setPostsError(err.message))
      .finally(() => setPostsLoading(false));
  }, [id, token]);

  useEffect(() => { loadGroup(); }, [loadGroup]);
  useEffect(() => { loadPosts(); }, [loadPosts]);

  const isMember = group?.members.includes(userId);
  const isAdmin  = role === 'ADMIN';

  // Join / Leave group
  const handleMembership = action => {
    fetch(`http://localhost:8080/api/groups/${id}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      body: JSON.stringify({ userId }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Membership action failed');
        return res.json();
      })
      .then(updated => setGroup(updated))
      .catch(err => setGroupError(err.message));
  };

  // Handle new post submission
  const handleSubmitPost = e => {
    e.preventDefault();
    setSubmitError('');
    setSubmitLoading(true);

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('content', newContent);
    newFiles.forEach(file => formData.append('files', file));

    fetch(`http://localhost:8080/api/posts/groups/${id}`, {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      body: formData,
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to submit post');
        return res.json();
      })
      .then(() => {
        setNewContent('');
        setNewFiles([]);
        loadPosts();
      })
      .catch(err => setSubmitError(err.message))
      .finally(() => setSubmitLoading(false));
  };

  // Delete a post (admin only)
  const handleDeletePost = postId => {
    fetch(`http://localhost:8080/api/posts/groups/${id}/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      body: JSON.stringify({ userId }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Delete failed');
        loadPosts();
      })
      .catch(err => setPostsError(err.message));
  };

  if (groupLoading) return <p className="p-6 text-gray-600">Loading group…</p>;
  if (groupError)   return <p className="p-6 text-red-600">{groupError}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6">

      {/* Group Header */}
      <div>
        <h1 className="text-3xl font-bold text-indigo-700 mb-1">{group.name}</h1>
        <p className="text-gray-700 mb-2">{group.description}</p>
        <p className="text-sm text-gray-500">
          Created by <span className="font-medium">{group.createdBy}</span> ·{' '}
          {group.members.length} member{group.members.length !== 1 && 's'}
        </p>
      </div>

      {/* Join / Leave Button (non-admins only) */}
      {!isAdmin && (
        <button
          onClick={() => handleMembership(isMember ? 'leave' : 'join')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            isMember
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isMember ? 'Leave Group' : 'Join Group'}
        </button>
      )}

      {/* Post Form (users only, must be member) */}
      {role === 'USER' && isMember && (
        <form onSubmit={handleSubmitPost} className="space-y-4">
          {submitError && <div className="text-red-600 text-sm">{submitError}</div>}
          <textarea
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            required
            placeholder="Write a post..."
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows={4}
            disabled={submitLoading}
          />
          <input
            type="file"
            multiple
            onChange={e => setNewFiles(Array.from(e.target.files))}
            disabled={submitLoading}
          />
          <button
            type="submit"
            disabled={submitLoading}
            className={`px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg transition ${
              submitLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
            }`}
          >
            {submitLoading ? 'Posting…' : 'Post'}
          </button>
        </form>
      )}

      {/* Posts List */}
      <div className="space-y-6">
        {postsLoading && <p className="text-gray-600">Loading posts…</p>}
        {postsError && <p className="text-red-600">{postsError}</p>}
        {!postsLoading && posts.length === 0 && (
          <p className="text-gray-500 italic">No posts yet.</p>
        )}

        {posts.map(post => (
          <div key={post.id} className="bg-gray-50 p-4 rounded-lg border space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{post.userName}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
              {role === 'ADMIN' && (
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>

            <p className="text-gray-700">{post.content}</p>

            {post.attachments?.length > 0 && (
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {post.attachments.map(url => (
                  <img
                    key={url}
                    src={url}
                    alt="attachment"
                    className="rounded-lg max-h-48 object-cover"
                  />
                ))}
              </div>
            )}

            {/* Like and Comment Actions */}
            <div className="flex items-center gap-4 mt-2">
              <PostActions
                postId={post.id}
                likeCount={post.likeCount}
                onLikeToggle={loadPosts}
              />
              <CommentsSection
                postId={post.id}
                comments={post.comments}
                onNewComment={loadPosts}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}