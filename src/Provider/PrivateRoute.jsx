import React from 'react';
import { Navigate, useLocation } from 'react-router-dom'; // ✅ right import
import useAuth from '../Hooks/UseAuth';

const PrivetRouter = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />; // ✅ Redirect with state
  }

  return children;
};

export default PrivetRouter;
