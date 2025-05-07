import React from 'react'

export default function CommentList({
    post,
    getProfilePicUrl,
    UserId,
    onCommentChange,
    onAddComment,
    commentInputs,
    postId
}) {
  return (
    <div>{post.commentsList.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
          {post.commentsList.map((comment, idx) => (
            <div key={idx} className="flex items-start space-x-2 mb-3">
              <img
                src={comment.avatar}
                alt={comment.username}
                className="w-8 h-8 rounded-full object-cover mt-1"
              />
              <div className="bg-white p-2 rounded-lg flex-1">
                <p className="font-medium text-sm">
                  {comment.username}
                </p>
                <p className="text-gray-800 text-sm">
                  {comment.content}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {comment.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
</div>
  )
}
