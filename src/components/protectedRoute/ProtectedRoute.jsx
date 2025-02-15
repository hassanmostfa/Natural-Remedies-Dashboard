import React from "react";
import { Navigate } from "react-router-dom";

// A protected route component
const ProtectedRoute = ({ children }) => {
  // Check if token exists in localStorage (or check from Redux state)
  const token = localStorage.getItem('token');

  // If no token, redirect to login page
  if (!token) {
    return <Navigate to="/admin/auth/sign-in" />;
  }

  // If authenticated, render the requested page (children)
  return children;
};

export default ProtectedRoute;
