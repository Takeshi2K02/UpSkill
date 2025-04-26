import React, { useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { CloudinaryContext } from 'cloudinary-react';
import { ToastContainer } from 'react-toastify'; // ✅ Add this
import 'react-toastify/dist/ReactToastify.css'; // ✅ Add this
import Login from './pages/Login';
import PrivateRoute from './middleware/PrivateRoute';
import AdminRoute from './middleware/AdminRoute';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import LearningPlans from './pages/LearningPlans';
import CreateLearningPlan from './pages/CreateLearningPlan';
import LearningPlanDetail from './pages/LearningPlanDetail';
import EditLearningPlan from './pages/EditLearningPlan';
import AdminDashboard from './pages/AdminDashboard';
import Unauthorized from './pages/Unauthorized';
import Profile from './pages/Profile';
import GroupsList from './pages/GroupsList';
import GroupDetail from './pages/GroupDetail';
import GroupForm from './pages/GroupForm';

function App() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const facebookId = sessionStorage.getItem('facebookId');
  const fbToken = sessionStorage.getItem('facebookAccessToken');

  const profilePicUrl =
    facebookId && fbToken
      ? `https://graph.facebook.com/${facebookId}/picture?width=480&height=480&access_token=${fbToken}`
      : null;

  const cloudName = import.meta.env.VITE_REACT_APP_CLOUDINARY_CLOUD_NAME;

  return (
    <CloudinaryContext cloudName={cloudName}>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Private Routes for logged in users */}
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/learning-plans" element={<PrivateRoute><LearningPlans /></PrivateRoute>} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/learning-plans/create" element={<PrivateRoute><CreateLearningPlan /></PrivateRoute>} />
          <Route path="/learning-plan/:id" element={<PrivateRoute><LearningPlanDetail /></PrivateRoute>} />
          <Route path="/learning-plan/edit/:id" element={<PrivateRoute><EditLearningPlan /></PrivateRoute>} />

          {/* Community Groups - all logged-in users */}
          <Route path="/groups" element={<PrivateRoute><GroupsList /></PrivateRoute>} />
          <Route path="/groups/:id" element={<PrivateRoute><GroupDetail /></PrivateRoute>} />

          {/* Community Groups - admin only */}
          <Route path="/groups/create" element={<AdminRoute><GroupForm /></AdminRoute>} />
          <Route path="/groups/edit/:id" element={<AdminRoute><GroupForm /></AdminRoute>} />

          {/* Admin-only routes */}
          <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* Unauthorized Page */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>

        {/* ✅ Toast container added here */}
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </CloudinaryContext>
  );
}

export default App;