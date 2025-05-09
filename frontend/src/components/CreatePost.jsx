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
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-6">
  <form onSubmit={handlePostSubmit}>
    <div className="flex items-start space-x-4">
      <img
        src={getProfilePicUrl(user.id)}
        alt="User"
        className="w-12 h-12 rounded-full object-cover border-2 border-blue-300"
      />
      <div className="flex-1">
        <textarea
          className="w-full p-4 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 resize-none text-gray-800 placeholder-gray-400"
          placeholder="What's on your mind? Share your knowledge..."
          rows="3"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
        />

        {/* File previews */}
        {previews.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {previews.map((preview, index) =>
              preview ? (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="h-24 w-24 object-cover rounded-lg border border-blue-200 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md group-hover:scale-105"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div
                  key={index}
                  className="relative h-24 w-24 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-200 text-blue-600 text-xs"
                >
                  Video
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md"
                  >
                    ×
                  </button>
                </div>
              )
            )}
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-3 items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="p-2 text-blue-500 hover:text-white hover:bg-blue-500 border border-blue-200 rounded-full transition duration-200"
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
                className="text-sm text-red-500 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          <button
            type="submit"
              className="px-5 py-2 text-white font-semibold rounded-xl shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#2B36AA' }}
            disabled={!newPostContent.trim() && files.length === 0}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  </form>
</div>
  );
};

export default CreatePost;