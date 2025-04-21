import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import CreatePost from "../components/CreatePost";
import CommonLayout from "../layouts/CommonLayout";
import Post from "../components/Post";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { userId } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const [newPostContent, setNewPostContent] = useState("");
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const fileInputRef = useRef(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    bio: "",
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const cloudName = import.meta.env.VITE_REACT_APP_CLOUDINARY_CLOUD_NAME;

  const getProfilePicUrl = (userId, userName) => {
    if (userId === currentUser?.id) {
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
    return (
      profileUser?.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userName
      )}&background=random`
    );
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);

        // Fetch user profile
        const userResponse = await axios.get(
          `http://localhost:8080/api/users/${
            userId === "me" ? currentUser.id : userId
          }`
        );
        setProfileUser(userResponse.data);

        // Check if current user is following this profile
        if (currentUser) {
          const followResponse = await axios.get(
            `http://localhost:8080/api/users/${currentUser.id}/isFollowing/${userResponse.data.id}`
          );
          setIsFollowing(followResponse.data.isFollowing);
        }

        // Fetch user posts
        const postsResponse = await axios.get(
          `http://localhost:8080/api/posts/user/${userResponse.data.id}`
        );

        const transformedPosts = postsResponse.data.map((post) => ({
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
          isLiked: post.likes ? post.likes.includes(currentUser?.id) : false,
        }));

        setPosts(transformedPosts);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setIsLoading(false);
      }
    };

    if (currentUser || userId !== "me") {
      fetchProfileData();
    }
  }, [userId, currentUser]);

  useEffect(() => {
    if (profileUser) {
      setEditFormData({
        name: profileUser.name || "",
        bio: profileUser.bio || "",
        avatar: null,
      });
      setAvatarPreview(profileUser.avatar || "");
    }
  }, [profileUser]);

  const handleFollow = async () => {
    try {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      const endpoint = isFollowing ? "unfollow" : "follow";
      await axios.post(
        `http://localhost:8080/api/users/${currentUser.id}/${endpoint}/${profileUser.id}`
      );

      setIsFollowing(!isFollowing);

      setProfileUser((prev) => ({
        ...prev,
        followersCount: isFollowing
          ? prev.followersCount - 1
          : prev.followersCount + 1,
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const post = posts.find((p) => p.id === postId);
      const endpoint = post.isLiked ? "unlike" : "like";

      await axios.post(
        `http://localhost:8080/api/posts/${postId}/${endpoint}`,
        { userId: currentUser.id }
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

  const handleEditInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Only JPEG, PNG, and GIF images are allowed");
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image must be less than 2MB");
        return;
      }

      setEditFormData({
        ...editFormData,
        avatar: file,
      });
      setAvatarPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("name", editFormData.name);
      formData.append("bio", editFormData.bio);
      if (editFormData.avatar) {
        formData.append("avatar", editFormData.avatar);
      }

      const response = await axios.put(
        `http://localhost:8080/api/users/${profileUser.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          },
        }
      );

      setProfileUser(response.data);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        setIsEditModalOpen(false);
        setSuccessMessage("");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
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

  if (isLoading) {
    return (
      <CommonLayout>
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center py-8">Loading profile...</div>
        </div>
      </CommonLayout>
    );
  }

  if (error && !isEditModalOpen) {
    return (
      <CommonLayout>
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-red-500 text-center py-8">Error: {error}</div>
        </div>
      </CommonLayout>
    );
  }

  if (!profileUser) {
    return (
      <CommonLayout>
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center py-8">User not found</div>
        </div>
      </CommonLayout>
    );
  }

  const isCurrentUserProfile =
    currentUser && (userId === "me" || userId === currentUser.id);

  return (
    <CommonLayout>
      <div className="max-w-4xl mx-auto p-4 relative">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={getProfilePicUrl(profileUser.id, profileUser.name)}
              alt={profileUser.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">{profileUser.name}</h1>
              <p className="text-gray-600 mb-4">
                {profileUser.bio || "No bio yet"}
              </p>

              <div className="flex justify-center md:justify-start space-x-6 mb-4">
                <div className="text-center">
                  <p className="font-bold">{posts.length}</p>
                  <p className="text-gray-500 text-sm">Posts</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{profileUser.followersCount || 0}</p>
                  <p className="text-gray-500 text-sm">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{profileUser.followingCount || 0}</p>
                  <p className="text-gray-500 text-sm">Following</p>
                </div>
              </div>

              {!isCurrentUserProfile && (
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-full font-medium ${
                    isFollowing
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}

              {isCurrentUserProfile && (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full font-medium hover:bg-gray-300"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Create Post Section */}
        {isCurrentUserProfile && (
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

        {/* User Posts */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
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
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">
                {isCurrentUserProfile
                  ? "You haven't posted anything yet."
                  : "This user hasn't posted anything yet."}
              </p>
            </div>
          )}
        </div>

        {/* Edit Profile Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit Profile</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                  disabled={isSaving}
                >
                  &times;
                </button>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                    disabled={isSaving}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={editFormData.bio}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows="3"
                    disabled={isSaving}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  {avatarPreview && (
                    <img
                      src={avatarPreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover mb-2"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/gif"
                    onChange={handleAvatarChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    disabled={isSaving}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Max size: 2MB (JPEG, PNG, GIF)
                  </p>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CommonLayout>
  );
};

export default Profile;
