import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { refreshToken, isTokenExpired } from "./remediesSlice";

const baseUrl = "https://api.naturalremediesapp.com/api";

export const videosApiService = createApi({
  reducerPath: "videosApiService",
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
    // Get all videos with optional search and pagination
    getVideos: builder.query({
      query: (searchParams = {}) => {
        const params = new URLSearchParams();
        if (searchParams.search) {
          params.append("search", searchParams.search);
        }
        if (searchParams.page) {
          params.append("page", String(searchParams.page));
        }
        if (searchParams.per_page) {
          params.append("per_page", String(searchParams.per_page));
        }
        const queryString = params.toString();
        return {
          url: `/videos${queryString ? `?${queryString}` : ""}`,
        };
      },
    }),

    // Get single video by ID
    getVideo: builder.query({
      query: (id) => ({ url: `/videos/${id}` }),
    }),

    // Create video
    createVideo: builder.mutation({
      query: (video) => ({
        url: "/videos",
        method: "POST",
        body: video,
      }),
    }),

    // Update video
    updateVideo: builder.mutation({
      query: ({ id, submissionData }) => ({
        url: `/videos/${id}`,
        method: "PUT",
        body: submissionData,
      }),
    }),

    // Delete video
    deleteVideo: builder.mutation({
      query: (id) => ({
        url: `/videos/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetVideosQuery,
  useGetVideoQuery,
  useCreateVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
} = videosApiService;