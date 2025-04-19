import React, { useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import PrivateRoute from './middleware/PrivateRoute';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import LearningPlans from './pages/LearningPlans';
import CreateLearningPlan from './pages/CreateLearningPlan';
import LearningPlanDetail from './pages/LearningPlanDetail';
import EditLearningPlan from './pages/EditLearningPlan';

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

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/learning-plans/create" element={<PrivateRoute><CreateLearningPlan /></PrivateRoute>} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/learning-plans" element={<PrivateRoute><LearningPlans /></PrivateRoute>} />
        <Route path="/learning-plan/:id" element={<PrivateRoute><LearningPlanDetail /></PrivateRoute>} />
        <Route path="/learning-plan/edit/:id" element={<PrivateRoute><EditLearningPlan /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;