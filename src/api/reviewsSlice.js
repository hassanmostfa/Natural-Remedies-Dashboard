import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { refreshToken, isTokenExpired } from "./remediesSlice";

const baseUrl = "https://remdy.mediagrafico.com/api";

export const reviewsApiService = createApi({
  reducerPath: "reviewsApiService",
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
    // List reviews with optional search, pagination, and status filter
    getReviews: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append("search", params.search);
        if (params.page) queryParams.append("page", String(params.page));
        if (params.per_page) queryParams.append("per_page", String(params.per_page));
        if (params.status) queryParams.append("status", params.status);
        if (params.type) queryParams.append("type", params.type);
        const queryString = queryParams.toString();
        return {
          url: `/reviews${queryString ? `?${queryString}` : ""}`,
        };
      },
      transformResponse: (response) => {
        // Return the full response to access both data and pagination
        return response;
      },
    }),

    // Get single review
    getReview: builder.query({
      query: (id) => ({ url: `/reviews/${id}` }),
      transformResponse: (response) => {
        // Return the data property if it exists, otherwise return the response as is
        return response.data || response;
      },
    }),

    // Create review
    createReview: builder.mutation({
      query: (review) => ({
        url: "/reviews",
        method: "POST",
        body: review,
      }),
    }),

    // Update review
    updateReview: builder.mutation({
      query: ({ id, submissionData }) => ({
        url: `/reviews/${id}`,
        method: "PUT",
        body: submissionData,
      }),
    }),

    // Approve review
    approveReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}/approve`,
        method: "PATCH",
      }),
    }),

    // Reject review
    rejectReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}/reject`,
        method: "PATCH",
      }),
    }),

    // Delete review
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
    }),

    // Get review statistics
    getReviewStats: builder.query({
      query: () => ({ url: "/reviews/stats" }),
      transformResponse: (response) => {
        return response.data || response;
      },
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGetReviewQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useApproveReviewMutation,
  useRejectReviewMutation,
  useDeleteReviewMutation,
  useGetReviewStatsQuery,
} = reviewsApiService;
