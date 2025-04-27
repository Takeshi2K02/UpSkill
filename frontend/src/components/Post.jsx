import React, { useState, useContext, useRef } from "react";
import { Image, Video } from "cloudinary-react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Post = ({
  post,
  onLike,
  onCommentChange,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  commentInputs,
  cloudName,
  getProfilePicUrl,
  onDeletePost,
  onUpdatePost,
}) => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [removedAttachments, setRemovedAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const [editingCommentId, setEditingCommentId] = useState(null); // ID of the comment being edited
  const [editedCommentText, setEditedCommentText] = useState(""); // Text of the comment being edited
  const [showCommentOptions, setShowCommentOptions] = useState({}); // Starts with no menu open


  const renderAttachment = (url) => {
    const isVideo =
      url.includes(".mp4") || url.includes(".webm") || url.includes(".mov");
    const publicId = url.split("/").slice(-2).join("/").split(".")[0];

    return (
      <div className="relative mt-3 rounded-lg overflow-hidden border border-gray-200">
        {isVideo ? (
          <Video
            cloudName={cloudName}
            publicId={publicId}
            controls
            className="w-full"
          />
        ) : (
          <Image
            cloudName={cloudName}
            publicId={publicId}
            className="w-full"
            alt="Post attachment"
          />
        )}
        {isEditing && (
          <button
            onClick={() => handleRemoveAttachment(url)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
          >
            ×
          </button>
        )}
      </div>
    );
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

    setFiles([...files, ...validFiles]);

    // Create previews for new files
    const newPreviews = validFiles.map((file) => {
      if (file.type.startsWith("image/")) {
        return URL.createObjectURL(file);
      }
      return null;
    });
    setPreviews([...previews, ...newPreviews]);
  };

  const handleRemoveAttachment = (url) => {
    setRemovedAttachments([...removedAttachments, url]);
  };

  const handleRemoveNewFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("content", editedContent);
      formData.append("removedAttachments", JSON.stringify(removedAttachments));

      files.forEach((file) => {
        formData.append("files", file);
      });

      await onUpdatePost(post.id, formData);
      setIsEditing(false);
      setFiles([]);
      setPreviews([]);
      setRemovedAttachments([]);
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      setIsDeleting(true);
      try {
        await onDeletePost(post.id);
      } catch (error) {
        console.error("Failed to delete post:", error);
        setIsDeleting(false);
      }
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedContent(post.content);
    setFiles([]);
    setPreviews([]);
    setRemovedAttachments([]);
  };

  const handleEditComment = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditedCommentText(currentContent);
  };

  const handleSaveComment = async (commentId) => {
    try {
      await onUpdateComment(post.id, commentId, editedCommentText); // Call the backend API
      const updatedComments = post.commentsList.map((comment) =>
        comment._id === commentId ? { ...comment, content: editedCommentText } : comment
      );
      post.commentsList = updatedComments; // Update the comments list
      setEditingCommentId(null);
      setEditedCommentText("");
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await onDeleteComment(post.id, commentId); // Call the backend API
        const updatedComments = post.commentsList.filter(
          (comment) => comment._id !== commentId
        );
        post.commentsList = updatedComments; // Update the comments list
      } catch (error) {
        console.error("Failed to delete comment:", error);
      }
    }
  };

  const toggleCommentMenu = (commentId) => {
    setShowCommentOptions((prev) => {
      const updated = { ...prev };
      if (updated[commentId]) {
        // If the menu is already open, close it
        delete updated[commentId];
      } else {
        // Open the clicked comment's menu
        updated[commentId] = true;
      }
      console.log("Updated showCommentOptions:", updated); // Debugging log
      return updated;
    });
  };
  
  

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={post.avatar}
            alt={post.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{post.username}</h3>
            <p className="text-gray-500 text-sm">{post.timestamp}</p>
          </div>
        </div>

        {user?.id === post.userId && (
          <div className="relative">
            <button
              className="text-gray-500 hover:text-gray-700 p-1"
              onClick={() => setShowOptions(!showOptions)}
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
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>

            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowOptions(false);
                      setIsEditing(true);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Post
                  </button>
                  <button
                    onClick={() => {
                      setShowOptions(false);
                      handleDelete();
                    }}
                    disabled={isDeleting}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    {isDeleting ? "Deleting..." : "Delete Post"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        {isEditing ? (
          <>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows="3"
            />

            {/* Current attachments (with remove option) */}
            {post.attachments && post.attachments.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  Current Attachments
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {post.attachments
                    .filter((url) => !removedAttachments.includes(url))
                    .map((url, index) => (
                      <div key={index}>{renderAttachment(url)}</div>
                    ))}
                </div>
              </div>
            )}

            {/* New attachments */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">
                Add New Attachments
              </h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    {preview ? (
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="h-20 w-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-500">Video</span>
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveNewFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Media
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*,video/*"
                className="hidden"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-800 mb-3">{post.content}</p>
            {post.attachments && post.attachments.length > 0 && (
              <div className="mt-3 space-y-3">
                {post.attachments.map((url, index) => (
                  <div key={index}>{renderAttachment(url)}</div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Post Stats and Actions (only show when not editing) */}
      {!isEditing && (
        <>
          <div className="px-4 py-2 border-t border-gray-100 text-sm text-gray-500 flex space-x-4">
            <span>
              {post.likes} {post.likes === 1 ? "like" : "likes"}
            </span>
            <span>
              {post.comments} {post.comments === 1 ? "comment" : "comments"}
            </span>
          </div>

          {/* Post Actions */}
          {/* Post Actions */}
          {user && (
            <>
              <div className="px-4 py-2 border-t border-gray-100 flex justify-around">
                <button
                  className={`flex items-center space-x-1 p-2 rounded-lg ${
                    post.isLiked
                      ? "text-blue-500"
                      : "text-gray-500 hover:text-blue-500"
                  }`}
                  onClick={() => onLike(post.id)}
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
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 p-2 rounded-lg">
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>Comment</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 p-2 rounded-lg">
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
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  <span>Share</span>
                </button>
              </div>

             {/* Comments List */}
              {post.commentsList.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                  {post.commentsList.map((comment, idx) => (
                    <div key={idx} className="flex items-start space-x-2 mb-3 relative">
                      {/* Avatar */}
                      <img
                        src={comment.avatar}
                        alt={comment.username}
                        className="w-8 h-8 rounded-full object-cover mt-1"
                      />

                      {/* Comment Content */}
                      <div className="bg-white p-2 rounded-lg flex-1">
                        {editingCommentId === comment._id ? (
                          <div>
                            <textarea
                              className="w-full p-2 border border-gray-300 rounded-md"
                              value={editedCommentText}
                              onChange={(e) => setEditedCommentText(e.target.value)}
                            />
                            <div className="mt-2 flex space-x-2">
                              <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                onClick={() => handleSaveComment(comment._id)}
                              >
                                Save
                              </button>
                              <button
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                onClick={() => setEditingCommentId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="font-medium text-sm">{comment.username}</p>
                            <p className="text-gray-800 text-sm">{comment.content}</p>
                            <p className="text-gray-500 text-xs mt-1">{comment.timestamp}</p>
                          </>
                        )}
                      </div>

                      {/* Three-Dot Menu for Comments */}
                      {user?.id === comment.userId && ( // Only show the menu if the user owns the comment
                        <div className="relative">
                          <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => toggleCommentMenu(comment._id)} // Use the updated toggle logic
                          >
                            &#x22EE; {/* Three-dot menu */}
                          </button>
                          {showCommentOptions[comment._id] && ( // Check if the menu for this comment is open
                            <div className="absolute right-0 bg-white border rounded shadow-md z-10">
                              <button
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => {
                                  setEditingCommentId(comment._id);
                                  setEditedCommentText(comment.content);
                                  setShowCommentOptions((prev) => ({
                                    ...prev,
                                    [comment._id]: false, // Close the menu after clicking "Edit"
                                  }));
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                onClick={() => {
                                  handleDeleteComment(comment._id);
                                  setShowCommentOptions((prev) => ({
                                    ...prev,
                                    [comment._id]: false, // Close the menu after clicking "Delete"
                                  }));
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}


              {/* Add Comment */}
              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center space-x-2">
                  <img
                    src={getProfilePicUrl(user.id)}
                    alt="You"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="flex-1 p-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={commentInputs[post.id] || ""}
                    onChange={(e) => onCommentChange(post.id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        onAddComment(post.id);
                      }
                    }}
                  />
                  <button
                    onClick={() => onAddComment(post.id)}
                    disabled={!commentInputs[post.id]?.trim()}
                    className="ml-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 disabled:opacity-50"
                  >
                    Post
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Post;
