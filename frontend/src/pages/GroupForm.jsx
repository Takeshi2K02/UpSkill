import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function GroupForm() {
  const { id } = useParams();                  // group ID for edit mode
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = sessionStorage.getItem('jwtToken');
  const createdBy = sessionStorage.getItem('facebookId');

  // If editing, fetch existing group data
  useEffect(() => {
    if (!isEdit) return;

    setLoading(true);
    fetch(`http://localhost:8080/api/groups/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load group data');
        return res.json();
      })
      .then(group => {
        setName(group.name);
        setDescription(group.description);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit, token]);

  // Handle form submission for create or edit
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = isEdit
      ? { name, description }
      : { name, description, createdBy };

    const url = isEdit
      ? `http://localhost:8080/api/groups/${id}`
      : 'http://localhost:8080/api/groups';

    const method = isEdit ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save group');
        return res.json();
      })
      .then(savedGroup => {
        navigate(`/groups/${savedGroup.id}`);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-10">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">
        {isEdit ? 'Edit Community Group' : 'Create New Community Group'}
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
            Group Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter group name"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows="4"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Describe the purpose of the group"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 font-semibold rounded-lg text-white transition 
              ${isEdit ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {loading
              ? isEdit ? 'Saving…' : 'Creating…'
              : isEdit ? 'Save Changes' : 'Create Group'
            }
          </button>
        </div>
      </form>
    </div>
  );
}