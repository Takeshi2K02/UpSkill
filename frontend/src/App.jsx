import React, { useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import PrivateRoute from './middleware/PrivateRoute';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clears session and context
    navigate('/login'); // Redirect to login
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <div className="flex flex-col items-center justify-center h-screen">
                <div className="bg-white shadow-md rounded-lg p-6 text-center w-96">
                  <h1 className="text-3xl font-bold mb-4">Welcome to UpSkill 🛡️</h1>
                  <p className="text-gray-600 mb-4">
                    Logged in as: <span className="font-semibold">{user?.name || 'Unknown User'}</span>
                  </p>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;