import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckTokenValidityQuery, useRefreshAdminTokenMutation } from '../../api/adminSlice';

const TokenManager = ({ children }) => {
  const navigate = useNavigate();
  const [refreshToken] = useRefreshAdminTokenMutation();
  const { data: tokenValidity, error: tokenError, refetch } = useCheckTokenValidityQuery();

  // Check token validity on component mount
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('admin_token');
      const tokenExpiry = localStorage.getItem('admin_token_expires_at');
      
      if (!token) {
        navigate('/admin/auth/sign-in');
        return;
      }

      // Check if token is expired
      if (tokenExpiry && new Date(tokenExpiry) <= new Date()) {
        try {
          const refreshTokenValue = localStorage.getItem('admin_refresh_token');
          if (refreshTokenValue) {
            await refreshToken(refreshTokenValue).unwrap();
          } else {
            navigate('/admin/auth/sign-in');
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          navigate('/admin/auth/sign-in');
        }
      }
    };

    checkToken();
  }, [navigate, refreshToken]);

  // Set up periodic token validation
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [refetch]);

  // Handle token validation errors
  useEffect(() => {
    if (tokenError) {
      console.error('Token validation failed:', tokenError);
      navigate('/admin/auth/sign-in');
    }
  }, [tokenError, navigate]);

  return <>{children}</>;
};

export default TokenManager; 