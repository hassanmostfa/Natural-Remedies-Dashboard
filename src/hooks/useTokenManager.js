import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRefreshAdminTokenMutation, useCheckTokenValidityQuery } from '../api/adminSlice';

export const useTokenManager = () => {
  const navigate = useNavigate();
  const [refreshToken] = useRefreshAdminTokenMutation();
  const { data: tokenValidity, error: tokenError, refetch } = useCheckTokenValidityQuery();

  // Check if token is expired
  const isTokenExpired = useCallback(() => {
    const tokenExpiry = localStorage.getItem('admin_token_expires_at');
    if (!tokenExpiry) return true;
    return new Date(tokenExpiry) <= new Date();
  }, []);

  // Manual token refresh
  const handleTokenRefresh = useCallback(async () => {
    try {
      const refreshTokenValue = localStorage.getItem('admin_refresh_token');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      await refreshToken(refreshTokenValue).unwrap();
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear all tokens and redirect to login
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_refresh_token');
      localStorage.removeItem('admin_token_expires_at');
      localStorage.removeItem('admin_refresh_token_expires_at');
      localStorage.removeItem('admin_data');
      navigate('/admin/auth/sign-in');
      return false;
    }
  }, [refreshToken, navigate]);

  // Check token validity on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    
    if (!token) {
      navigate('/admin/auth/sign-in');
      return;
    }

    if (isTokenExpired()) {
      handleTokenRefresh();
    }
  }, [navigate, isTokenExpired, handleTokenRefresh]);

  // Handle token validation errors
  useEffect(() => {
    if (tokenError) {
      console.error('Token validation failed:', tokenError);
      handleTokenRefresh();
    }
  }, [tokenError, handleTokenRefresh]);

  // Set up periodic token validation
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [refetch]);

  return {
    isTokenExpired,
    handleTokenRefresh,
    tokenValidity,
    tokenError,
  };
}; 