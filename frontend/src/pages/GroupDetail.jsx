// src/pages/GroupDetail.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, MessageCircle, Share2 } from 'lucide-react';

import CommonLayout from '../layouts/CommonLayout';
import PostActions  from '../components/PostActions';
import CommentsSection from '../components/CommentsSection';

export default function GroupDetail() {
  const { id } = useParams();
  const token       = sessionStorage.getItem('jwtToken');
  const accessToken = sessionStorage.getItem('facebookAccessToken');
  const userId      = sessionStorage.getItem('facebookId');
  const role        = sessionStorage.getItem('role');

  const [group, setGroup]               = useState(null);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [errorGroup, setErrorGroup]     = useState('');

  const [posts, setPosts]               = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [errorPosts, setErrorPosts]     = useState('');

  const [newContent, setNewContent]   = useState('');
  const [newFiles, setNewFiles]       = useState([]);
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Load group
  const loadGroup = useCallback(() => {
    setLoadingGroup(true);
    fetch(`http://localhost:8080/api/groups/${id}`, {
      headers: { Authorization: token ? `Bearer ${token}` : undefined }
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setGroup)
      .catch(() => setErrorGroup('Unable to load group'))
      .finally(() => setLoadingGroup(false));
  }, [id, token]);

  // Load posts
  const loadPosts = useCallback(() => {
    setLoadingPosts(true);
    fetch(`http://localhost:8080/api/posts/groups/${id}`, {
      headers: { Authorization: token ? `Bearer ${token}` : undefined }
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setPosts)
      .catch(() => setErrorPosts('Unable to load posts'))
      .finally(() => setLoadingPosts(false));
  }, [id, token]);

  useEffect(() => { loadGroup(); }, [loadGroup]);
  useEffect(() => { loadPosts(); }, [loadPosts]);

  // Loading / error states
  if (loadingGroup) {
    return (
      <CommonLayout>
        <div className="p-6 animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </CommonLayout>
    );
  }
  if (errorGroup) {
    return (
      <CommonLayout>
        <p className="p-6 text-red-600">{errorGroup}</p>
      </CommonLayout>
    );
  }

  const isMember = group.members.includes(userId);
  const isAdmin  = role === 'ADMIN';

  const toggleMembership = () => {
    fetch(`http://localhost:8080/api/groups/${id}/${isMember ? 'leave' : 'join'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined
      },
      body: JSON.stringify({ userId })
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setGroup)
      .catch(() => setErrorGroup('Membership update failed'));
  };

  const submitPost = e => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    const fd = new FormData();
    fd.append('userId', userId);
    fd.append('content', newContent);
    newFiles.forEach(f => fd.append('files', f));

    fetch(`http://localhost:8080/api/posts/groups/${id}`, {
      method: 'POST',
      headers: { Authorization: token ? `Bearer ${token}` : undefined },
      body: fd
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(() => {
        setNewContent(''); setNewFiles([]);
        loadPosts();
      })
      .catch(() => setSubmitError('Post submission failed'))
      .finally(() => setSubmitting(false));
  };

  const deletePost = postId => {
    fetch(`http://localhost:8080/api/posts/groups/${id}/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined
      },
      body: JSON.stringify({ userId })
    })
      .then(r => {
        if (!r.ok) throw new Error();
        loadPosts();
      })
      .catch(() => setErrorPosts('Delete failed'));
  };

  return (
    <CommonLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start space-y-4 md:space-y-0">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-indigo-700">{group.name}</h1>
            <p className="text-gray-700 mt-1">{group.description}</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Users className="h-5 w-5 mr-1" /> {group.members.length} members
            </div>
          </div>
          <div className="flex-shrink-0 flex gap-3">
            {isAdmin ? (
              <Link
                to={`/groups/edit/${group.id}`}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                Edit Group
              </Link>
            ) : (
              <button
                onClick={toggleMembership}
                className={`px-4 py-2 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  isMember
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isMember ? 'Leave Group' : 'Join Group'}
              </button>
            )}
          </div>
        </div>

        {/* New Post */}
        {role === 'USER' && isMember && (
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            {submitError && <p className="text-red-600">{submitError}</p>}
            <form onSubmit={submitPost} className="space-y-4">
              <textarea
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                rows={4}
                required
                placeholder="Share something..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                disabled={submitting}
              />
              <input
                type="file"
                multiple
                onChange={e => setNewFiles(Array.from(e.target.files))}
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold transition ${
                  submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
                }`}
              >
                {submitting ? 'Posting…' : 'Post'}
              </button>
            </form>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-6">
          {loadingPosts ? (
            <div className="space-y-4 animate-pulse">
              {[1,2,3].map(i => (
                <div key={i} className="h-40 bg-gray-200 rounded-lg" />
              ))}
            </div>
          ) : errorPosts ? (
            <p className="text-red-600">{errorPosts}</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-500 italic">No posts yet.</p>
          ) : posts.map(post => {
            const profilePicUrl = `https://graph.facebook.com/${post.userId}/picture?width=48&height=48&access_token=${accessToken}`;
            return (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">

                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={profilePicUrl}
                      alt={post.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{post.userName}</p>
                      <time className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleString()}
                      </time>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-red-600 hover:text-red-700 focus:outline-none"
                      aria-label="Delete post"
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* Body */}
                <div className="px-4 pb-3">
                  <p className="text-gray-700">{post.content}</p>
                  {post.attachments?.length > 0 && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {post.attachments.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt="Attachment"
                          className="rounded-lg object-cover w-full max-h-48"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-4 py-2 border-t border-gray-100 flex justify-around">
                  <PostActions postId={post.id} likeCount={post.likeCount} onLikeToggle={loadPosts} />
                  <button className="flex items-center space-x-1 p-2 text-gray-500 hover:text-blue-500 rounded-lg focus:outline-none">
                    <MessageCircle className="h-5 w-5" /><span>Comment</span>
                  </button>
                  <button className="flex items-center space-x-1 p-2 text-gray-500 hover:text-blue-500 rounded-lg focus:outline-none">
                    <Share2 className="h-5 w-5" /><span>Share</span>
                  </button>
                </div>

                {/* Comments */}
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                  <CommentsSection postId={post.id} comments={post.comments} onNewComment={loadPosts}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CommonLayout>
  );
}
