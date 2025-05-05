import React from 'react'

export default function EditProfileModal({
    isEditModalOpen,
    setIsEditModalOpen,
    editFormData,
    handleEditInputChange,
    handleAvatarChange,
    avatarPreview,
    handleEditSubmit,
    isSaving,
    error,
    successMessage
}) {
  return (
    <div>
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
  )
}
