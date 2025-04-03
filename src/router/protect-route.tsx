import { Navigate, useLocation } from 'react-router-dom';
import useAuthHooks from '@/hooks/useAuthHooks';
import React, { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuth } = useAuthHooks();
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;