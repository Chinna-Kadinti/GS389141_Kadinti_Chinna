// src/components/Auth/PrivateRoute.tsx
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { login } from '../../redux/slices/authSlice';
import { getAuth } from '../../services/localStorage.service';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const location = useLocation();
  
  useEffect(() => {
    // Check if user is stored in localStorage but not in Redux state
    if (!isAuthenticated) {
      const username = getAuth();
      if (username) {
        dispatch(login(username));
      }
    }
  }, [isAuthenticated, dispatch]);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    const username = getAuth();
    if (username) {
      // If we found a username in localStorage, we're in the process of authenticating
      // Return null to prevent rendering until the authentication process completes
      return null;
    }
    
    // Otherwise, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If authenticated, render the child routes
  return <Outlet />;
};

export default PrivateRoute;