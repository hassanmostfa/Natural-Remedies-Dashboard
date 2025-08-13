import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { refreshToken, isTokenExpired } from "./remediesSlice";

const baseUrl = "https://remdy.mediagrafico.com/api";

export const articlesApiService = createApi({
  reducerPath: "articlesApiService",
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
    // List articles with optional search and pagination
    getArticles: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append("search", params.search);
        if (params.page) queryParams.append("page", String(params.page));
        if (params.per_page) queryParams.append("per_page", String(params.per_page));
        const queryString = queryParams.toString();
        return {
          url: `/articles${queryString ? `?${queryString}` : ""}`,
        };
      },
      transformResponse: (response) => {
        // Return the full response to preserve pagination and other metadata
        return response;
      },
    }),

    // Get single article
    getArticle: builder.query({
      query: (id) => ({ url: `/articles/${id}` }),
      transformResponse: (response) => {
        // Return the full response to preserve metadata
        return response;
      },
    }),

    // Create article
    createArticle: builder.mutation({
      query: (article) => ({
        url: "/articles",
        method: "POST",
        body: article,
      }),
    }),

    // Update article
    updateArticle: builder.mutation({
      query: ({ id, submissionData }) => ({
        url: `/articles/${id}`,
        method: "PUT",
        body: submissionData,
      }),
    }),

    // Delete article
    deleteArticle: builder.mutation({
      query: (id) => ({
        url: `/articles/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = articlesApiService;


