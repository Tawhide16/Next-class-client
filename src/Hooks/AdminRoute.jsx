import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Provider/AuthProvider';
import useAdmin from '../Hooks/useAdmin';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const [isAdmin, isAdminLoading] = useAdmin(user?.email);

  if (loading || isAdminLoading) {
    return <p className="text-center text-lg">Loading...</p>;
  }

  if (user && isAdmin) {
    return children;
  }

  return <Navigate to="/" />;
};

export default AdminRoute;
