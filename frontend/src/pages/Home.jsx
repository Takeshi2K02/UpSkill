// src/pages/Home.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import CommonLayout from "../layouts/CommonLayout";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const getProfilePicUrl = (userId, userName) => {
    if (userId === user?.id) {
      const facebookId = sessionStorage.getItem("facebookId");
      const fbToken = sessionStorage.getItem("facebookAccessToken");
      if (facebookId && fbToken) {
        return `https://graph.facebook.com/${facebookId}/picture?width=200&height=200&access_token=${fbToken}`;
      }
    } else {
      const fbToken = sessionStorage.getItem("facebookAccessToken");
      if (fbToken) {
        return `https://graph.facebook.com/${userId}/picture?width=200&height=200&access_token=${fbToken}`;
      }
    }

    const nameForAvatar = userName || `User ${userId.slice(0, 5)}`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      nameForAvatar
    )}&background=random&length=2`;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/posts");

        const transformedPosts = response.data.map((post) => ({
          id: post.id,
          userId: post.userId,
          username:
            post.userName ||
            (post.userId === user?.id
              ? "You"
              : `User ${post.userId.slice(0, 5)}`),
          avatar:
            post.userAvatar || getProfilePicUrl(post.userId, post.userName),
          content: post.content,
          attachments: post.attachments || [],
          timestamp: new Date(post.createdAt).toLocaleString(),
          likes: post.likeCount || 0,
          comments: post.commentCount || 0,
          commentsList: (post.comments || []).map((comment) => ({
            _id: comment.id,
            userId: comment.userId,
            username:
              comment.userName ||
              (comment.userId === user?.id
                ? "You"
                : `User ${comment.userId.slice(0, 5)}`),
            avatar:
              comment.userAvatar ||
              getProfilePicUrl(comment.userId, comment.userName),
            content: comment.content,
            timestamp: new Date(comment.createdAt).toLocaleString(),
          })),
          isLiked: post.likes ? post.likes.includes(user?.id) : false,
        }));

        setPosts(transformedPosts);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [user]);

  // ... (keep all your existing file handling functions)

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim() && files.length === 0) return;

    try {
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("content", newPostContent);

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post(
        "http://localhost:8080/api/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          },
        }
      );

      const newPost = {
        id: response.data.id,
        userId: user.id,
        username: "You",
        avatar: getProfilePicUrl(user.id, user.name),
        content: newPostContent,
        attachments: response.data.attachments || [],
        timestamp: "Just now",
        likes: 0,
        comments: 0,
        commentsList: [],
        isLiked: false,
      };

      setPosts([newPost, ...posts]);
      setNewPostContent("");
      clearFiles();
    } catch (err) {
      setError("Failed to create post");
      console.error(err);
    }
  };

  // In your Home.jsx, add this function if it's missing
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const validFiles = selectedFiles.filter((file) => {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4",
        "video/webm",
        "video/quicktime",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        alert(`File type not supported: ${file.name}`);
        return false;
      }

      if (file.size > maxSize) {
        alert(`File too large (max 10MB): ${file.name}`);
        return false;
      }

      return true;
    });

    setFiles(validFiles);

    // Create previews for images
    const filePreviews = validFiles.map((file) => {
      if (file.type.startsWith("image/")) {
        return URL.createObjectURL(file);
      }
      return null;
    });
    setPreviews(filePreviews);
  };

  // Remove a file from the selection
  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]); // Clean up memory
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  // Clear all files
  const clearFiles = () => {
    // Clean up memory for all preview URLs
    previews.forEach((preview) => {
      if (preview) URL.revokeObjectURL(preview);
    });

    setFiles([]);
    setPreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLikePost = async (postId) => {
    if (!user) return;

    try {
      const post = posts.find((p) => p.id === postId);
      const endpoint = post.isLiked ? "unlike" : "like";

      await axios.post(
        `http://localhost:8080/api/posts/${postId}/${endpoint}`,
        { userId: user.id },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          },
        }
      );

      setPosts(
        posts.map((p) =>
          p.id === postId
            ? {
                ...p,
                likes: p.isLiked ? p.likes - 1 : p.likes + 1,
                isLiked: !p.isLiked,
              }
            : p
        )
      );
    } catch (err) {
      setError("Failed to like post");
      console.error(err);
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleAddComment = async (postId) => {
    const commentContent = commentInputs[postId];
    if (!commentContent?.trim() || !user) return;

    try {
      await axios.post(
        `http://localhost:8080/api/posts/${postId}/comments`,
        {
          userId: user.id,
          content: commentContent,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          },
        }
      );

      setPosts(
        posts.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: p.comments + 1,
                commentsList: [
                  ...p.commentsList,
                  {
                    userId: user.id,
                    username: "You",
                    avatar: getProfilePicUrl(user.id),
                    content: commentContent,
                    timestamp: "Just now",
                  },
                ],
              }
            : p
        )
      );

      setCommentInputs((prev) => ({
        ...prev,
        [postId]: "",
      }));
    } catch (err) {
      setError("Failed to add comment");
      console.error(err);
    }
  };
  // Add these functions to your Profile.jsx
  const handleUpdatePost = async (postId, formData) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/posts/${postId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          },
        }
      );

      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                content: response.data.content,
                attachments: response.data.attachments || [],
              }
            : post
        )
      );

      return response.data;
    } catch (err) {
      setError("Failed to update post");
      console.error(err);
      throw err;
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
        },
      });
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      setError("Failed to delete post");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <CommonLayout>
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center py-8">Loading posts...</div>
        </div>
      </CommonLayout>
    );
  }

  if (error) {
    return (
      <CommonLayout>
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-red-500 text-center py-8">Error: {error}</div>
        </div>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout>
      <div className="max-w-4xl mx-auto p-4">
        {/* Create Post Section */}
        {user && (
          <CreatePost
            user={user}
            newPostContent={newPostContent}
            setNewPostContent={setNewPostContent}
            handlePostSubmit={handlePostSubmit}
            files={files}
            previews={previews}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
            clearFiles={clearFiles}
            fileInputRef={fileInputRef}
            getProfilePicUrl={getProfilePicUrl}
          />
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onLike={handleLikePost}
              onCommentChange={handleCommentChange}
              onAddComment={handleAddComment}
              commentInputs={commentInputs}
              cloudName={cloudName}
              getProfilePicUrl={getProfilePicUrl}
              onDeletePost={handleDeletePost}
              onUpdatePost={handleUpdatePost}
            />
          ))}
        </div>
      </div>
    </CommonLayout>
  );
}
