import React from "react";
import { Navigate } from "react-router-dom";

// A protected route component
const ProtectedRoute = ({ children }) => {
  // Check if admin token exists in localStorage
  const adminToken = localStorage.getItem('admin_token');
  
  console.log("ProtectedRoute: Checking admin token:", adminToken ? "exists" : "not found");

  // If no admin token, redirect to login page
  if (!adminToken) {
    console.log("ProtectedRoute: No admin token, redirecting to login");
    return <Navigate to="/admin/auth/sign-in" />;
  }

  console.log("ProtectedRoute: Admin token found, rendering children");
  // If authenticated, render the requested page (children)
  return children;
};

export default ProtectedRoute;
