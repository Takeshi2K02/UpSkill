// src/components/CreatePost.jsx
import React, { useRef } from "react";

const CreatePost = ({
  user,
  newPostContent,
  setNewPostContent,
  handlePostSubmit,
  files,
  previews,
  handleFileChange,
  removeFile,
  clearFiles,
  fileInputRef,
  getProfilePicUrl
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handlePostSubmit}>
        <div className="flex items-start space-x-3">
          <img
            src={getProfilePicUrl(user.id)}
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="What's on your mind? Share your knowledge..."
              rows="3"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />

            {/* File previews */}
            {previews.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {previews.map((preview, index) =>
                  preview ? (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div
                      key={index}
                      className="relative h-20 w-20 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-200"
                    >
                      <span className="text-gray-500 text-xs">Video</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
              </div>
            )}

            <div className="flex justify-between items-center mt-3">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="p-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-gray-100"
                  title="Add media"
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                />
                {files.length > 0 && (
                  <button
                    type="button"
                    onClick={clearFiles}
                    className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-gray-100 text-sm"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                disabled={!newPostContent.trim() && files.length === 0}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;