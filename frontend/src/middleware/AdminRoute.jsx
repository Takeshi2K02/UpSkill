import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const token = sessionStorage.getItem('jwtToken');
  const role = sessionStorage.getItem('role');

  return token && role === 'ADMIN' ? children : <Navigate to="/unauthorized" replace />;
};

export default AdminRoute;