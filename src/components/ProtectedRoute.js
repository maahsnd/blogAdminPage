import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useUserContext } from './UserContext';

function ProtectedRoute({ element, ...rest }) {
  const { user } = useUserContext();

  return user ? (
    <Route {...rest} element={element} />
  ) : (
    <Navigate to="/login" />
  );
}

export default ProtectedRoute;
