import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "https://api.naturalremediesapp.com/api";

const createRequest = (url) => ({ url });

const isTokenExpired = (tokenExpiry) => {
  if (!tokenExpiry) return true;
  return new Date(tokenExpiry) <= new Date();
};

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
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_refresh_token");
    localStorage.removeItem("admin_token_expires_at");
    localStorage.removeItem("admin_refresh_token_expires_at");
    localStorage.removeItem("admin_data");
    throw error;
  }
};

export const usersApiService = createApi({
  reducerPath: "usersApiService",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      const token = localStorage.getItem("admin_token");
      const tokenExpiry = localStorage.getItem("admin_token_expires_at");

      if (token && isTokenExpired(tokenExpiry)) {
        try {
          const newToken = await refreshToken();
          headers.set("Authorization", `Bearer ${newToken}`);
        } catch (error) {
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
    // Get all users with optional search and pagination
    getUsers: builder.query({
      query: (searchParams = {}) => {
        const params = new URLSearchParams();
        if (searchParams.name) {
          params.append("name", searchParams.name);
        }
        if (searchParams.email) {
          params.append("email", searchParams.email);
        }
        if (searchParams.status) {
          params.append("status", searchParams.status);
        }
        if (searchParams.page) {
          params.append("page", String(searchParams.page));
        }
        if (searchParams.per_page) {
          params.append("per_page", String(searchParams.per_page));
        }
        const queryString = params.toString();
        return {
          url: `/users${queryString ? `?${queryString}` : ""}`,
        };
      },
      transformResponse: (response) => {
        // Return the full response to access both data and pagination
        return response;
      },
    }),

    // Get a single user by ID
    getUser: builder.query({
      query: (id) => createRequest(`/users/${id}`),
    }),

    // Create user
    createUser: builder.mutation({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
    }),

    // Update user
    updateUser: builder.mutation({
      query: ({ id, user }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: user,
      }),
    }),

    // Delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
    }),

    // Update user status (activate/deactivate)
    updateUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/users/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
    }),

    // Reset user password
    resetUserPassword: builder.mutation({
      query: ({ id, password }) => ({
        url: `/users/${id}/password`,
        method: "PATCH",
        body: { password },
      }),
    }),

    // Get user statistics
    getUserStats: builder.query({
      query: () => createRequest("/users/stats"),
    }),

    // Get users by role
    getUsersByRole: builder.query({
      query: (role) => ({
        url: `/users/role/${role}`,
      }),
    }),

    // Bulk operations
    bulkUpdateUsers: builder.mutation({
      query: ({ ids, updates }) => ({
        url: "/users/bulk-update",
        method: "PATCH",
        body: { ids, updates },
      }),
    }),

    bulkDeleteUsers: builder.mutation({
      query: ({ ids }) => ({
        url: "/users/bulk-delete",
        method: "DELETE",
        body: { ids },
      }),
    }),

    // Export users
    exportUsers: builder.query({
      query: (format = 'csv') => ({
        url: `/users/export?format=${format}`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Import users
    importUsers: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: "/users/import",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
  useResetUserPasswordMutation,
  useGetUserStatsQuery,
  useGetUsersByRoleQuery,
  useBulkUpdateUsersMutation,
  useBulkDeleteUsersMutation,
  useExportUsersQuery,
  useImportUsersMutation,
} = usersApiService;

export { refreshToken, isTokenExpired };
