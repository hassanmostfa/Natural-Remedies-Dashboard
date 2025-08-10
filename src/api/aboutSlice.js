import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = "https://remdy.mediagrafico.com/api";

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

const baseQuery = fetchBaseQuery({
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
});

export const aboutApiService = createApi({
  reducerPath: 'aboutApi',
  baseQuery,
  tagTypes: ['About'],
  endpoints: (builder) => ({
    // Get all about content
    getAbout: builder.query({
      query: (params = {}) => ({
        url: '/about',
        method: 'GET',
        params,
      }),
      providesTags: ['About'],
    }),

    // Get single about content by ID
    getAboutById: builder.query({
      query: (id) => ({
        url: `/about/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'About', id }],
    }),

    // Create new about content
    createAbout: builder.mutation({
      query: (data) => ({
        url: '/about',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['About'],
    }),

    // Update about content
    updateAbout: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/about/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        'About',
        { type: 'About', id }
      ],
    }),

    // Delete about content
    deleteAbout: builder.mutation({
      query: (id) => ({
        url: `/about/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['About'],
    }),
  }),
});

export const {
  useGetAboutQuery,
  useGetAboutByIdQuery,
  useCreateAboutMutation,
  useUpdateAboutMutation,
  useDeleteAboutMutation,
} = aboutApiService;
