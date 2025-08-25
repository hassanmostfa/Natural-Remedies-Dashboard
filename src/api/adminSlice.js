import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define your base URL
const baseUrl = "https://api.naturalremediesapp.com/api"; // Replace with your actual base URL

// Function to create request
const createRequest = (url) => ({ url });

// Function to check if token is expired
const isTokenExpired = (tokenExpiry) => {
  if (!tokenExpiry) return true;
  return new Date(tokenExpiry) <= new Date();
};

// Function to refresh token
const refreshToken = async () => {
  const refreshToken = localStorage.getItem("admin_refresh_token");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await fetch(`${baseUrl}/auth/admin/refresh?refresh_token=${refreshToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    
    if (data.success && data.access_token) {
      localStorage.setItem("admin_token", data.access_token);
      localStorage.setItem("admin_refresh_token", data.refresh_token);
      localStorage.setItem("admin_token_expires_at", data.access_token_expires_at);
      localStorage.setItem("admin_refresh_token_expires_at", data.refresh_token_expires_at);
      return data.access_token;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    // Clear all tokens on refresh failure
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_refresh_token");
    localStorage.removeItem("admin_token_expires_at");
    localStorage.removeItem("admin_refresh_token_expires_at");
    localStorage.removeItem("admin_data");
    throw error;
  }
};

// Create the API slice using RTK Query
export const adminApiService = createApi({
  reducerPath: "adminApiService",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      // Get the token from localStorage
      const token = localStorage.getItem("admin_token");
      const tokenExpiry = localStorage.getItem("admin_token_expires_at");

      // Check if token is expired and try to refresh it
      if (token && isTokenExpired(tokenExpiry)) {
        try {
          const newToken = await refreshToken();
          headers.set("Authorization", `Bearer ${newToken}`);
        } catch (error) {
          // If refresh fails, redirect to login
          window.location.href = "/admin/auth/sign-in";
          throw error;
        }
      } else if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  endpoints: (builder) => ({
    // Admin login request
    loginAdmin: builder.mutation({
      query: (adminCredentials) => ({
        url: "/auth/admin/login",
        method: "POST",
        body: adminCredentials, // Sending admin credentials (email and password)
      }),
      // Transform the response to handle the specific structure
      transformResponse: (response) => {
        // Store tokens in localStorage
        if (response.success && response.access_token) {
          localStorage.setItem("admin_token", response.access_token);
          localStorage.setItem("admin_refresh_token", response.refresh_token);
          localStorage.setItem("admin_token_expires_at", response.access_token_expires_at);
          localStorage.setItem("admin_refresh_token_expires_at", response.refresh_token_expires_at);
          localStorage.setItem("admin_data", JSON.stringify(response.admin));
        }
        return response;
      },
    }),

    // Refresh token endpoint (manual refresh)
    refreshAdminToken: builder.mutation({
      query: (refreshToken) => ({
        url: `/auth/admin/refresh?refresh_token=${refreshToken}`,
        method: "POST",
      }),
      transformResponse: (response) => {
        // Update tokens in localStorage
        if (response.success && response.access_token) {
          localStorage.setItem("admin_token", response.access_token);
          localStorage.setItem("admin_refresh_token", response.refresh_token);
          localStorage.setItem("admin_token_expires_at", response.access_token_expires_at);
          localStorage.setItem("admin_refresh_token_expires_at", response.refresh_token_expires_at);
        }
        return response;
      },
    }),

    // Check token validity
    checkTokenValidity: builder.query({
      query: () => ({
        url: "/auth/admin/me", // Assuming there's an endpoint to check token validity
        method: "GET",
      }),
    }),

    // Get all admins with search and pagination
    getAdmins: builder.query({
      query: (searchParams = {}) => {
        const params = new URLSearchParams();
        if (searchParams.name) {
          params.append('name', searchParams.name);
        }
        if (searchParams.page) {
          params.append('page', String(searchParams.page));
        }
        if (searchParams.per_page) {
          params.append('per_page', String(searchParams.per_page));
        }
        const queryString = params.toString();
        return {
          url: `/admins${queryString ? `?${queryString}` : ''}`,
        };
      },
      transformResponse: (response) => {
        // Return the full response to access both data and pagination
        return response;
      },
    }),

    // Get admin profile
    getAdminProfile: builder.query({
      query: (adminId) => createRequest(`/admins/${adminId}`),
    }),

    // Create admin
    createAdmin: builder.mutation({
      query: (admin) => ({
        url: "/admins",
        method: "POST",
        body: admin,
      }),
    }),

    // Update admin
    updateAdmin: builder.mutation({
      query: ({id, admin}) => ({
        url: `/admins/${id}`,
        method: "PUT",
        body: admin,
      }),
    }),

    // Delete admin
    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/admins/${id}`,
        method: "DELETE",
      }),
    }),

    // Logout admin (clear tokens)
    logoutAdmin: builder.mutation({
      query: () => ({
        url: "/auth/admin/logout",
        method: "POST",
      }),
      transformResponse: () => {
        // Clear all admin-related tokens and data from localStorage
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_refresh_token");
        localStorage.removeItem("admin_token_expires_at");
        localStorage.removeItem("admin_refresh_token_expires_at");
        localStorage.removeItem("admin_data");
        return { success: true };
      },
    }),
  }),
});

// Export hooks generated by the API service
export const { 
  useLoginAdminMutation, 
  useRefreshAdminTokenMutation,
  useCheckTokenValidityQuery,
  useGetAdminProfileQuery, 
  useGetAdminsQuery, 
  useCreateAdminMutation, 
  useUpdateAdminMutation, 
  useDeleteAdminMutation,
  useLogoutAdminMutation
} = adminApiService;

// Export utility functions
export { refreshToken, isTokenExpired }; 