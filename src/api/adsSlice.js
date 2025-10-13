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

export const adsApiService = createApi({
  reducerPath: "adsApiService",
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
    // Get all ads with optional search and pagination
    getAds: builder.query({
      query: (searchParams = {}) => {
        const params = new URLSearchParams();
        if (searchParams.title) {
          params.append("title", searchParams.title);
        }
        if (searchParams.status) {
          params.append("status", searchParams.status);
        }
        if (searchParams.type) {
          params.append("type", searchParams.type);
        }
        if (searchParams.page) {
          params.append("page", String(searchParams.page));
        }
        if (searchParams.per_page) {
          params.append("per_page", String(searchParams.per_page));
        }
        const queryString = params.toString();
        return {
          url: `/ads${queryString ? `?${queryString}` : ""}`,
        };
      },
      transformResponse: (response) => {
        // Return the full response to access both data and pagination
        return response;
      },
    }),

    // Get a single ad by ID
    getAd: builder.query({
      query: (id) => createRequest(`/ads/${id}`),
    }),

    // Create ad
    createAd: builder.mutation({
      query: (ad) => ({
        url: "/ads",
        method: "POST",
        body: ad,
      }),
    }),

    // Update ad
    updateAd: builder.mutation({
      query: ({ id, ad }) => ({
        url: `/ads/${id}`,
        method: "PUT",
        body: ad,
      }),
    }),

    // Delete ad
    deleteAd: builder.mutation({
      query: (id) => ({
        url: `/ads/${id}`,
        method: "DELETE",
      }),
    }),

    // Toggle ad status
    toggleAdStatus: builder.mutation({
      query: (id) => ({
        url: `/ads/${id}/toggle-status`,
        method: "PATCH",
      }),
    }),

    // Get ad types
    getAdTypes: builder.query({
      query: () => "/ads-types",
      transformResponse: (response) => {
        return response;
      },
    }),
  }),
});

export const {
  useGetAdsQuery,
  useGetAdQuery,
  useCreateAdMutation,
  useUpdateAdMutation,
  useDeleteAdMutation,
  useToggleAdStatusMutation,
  useGetAdTypesQuery,
} = adsApiService;

export { refreshToken, isTokenExpired };
