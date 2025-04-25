import React from "react";
 
const CommentSection = ({
  getProfilePicUrl,
  onCommentChange,
  onAddComment,
  commentInputs,
  postId,
  UserId,
}) => {
  return (
    <>
      <div>
        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center space-x-2">
            <img
              src={getProfilePicUrl(UserId)}
              alt="You"
              className="w-8 h-8 rounded-full object-cover"
            />
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 p-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={commentInputs[postId] || ""}
              onChange={(e) => onCommentChange(postId, e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddComment(postId);
                }
              }}
            />
            <button
              onClick={() => onAddComment(postId)}
              disabled={!commentInputs[postId]?.trim()}
              className="ml-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 disabled:opacity-50"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
 
export default CommentSection;