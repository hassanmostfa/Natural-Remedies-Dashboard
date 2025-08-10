import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "https://remdy.mediagrafico.com/api";

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

export const contactUsApiService = createApi({
  reducerPath: "contactUsApiService",
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

  tagTypes: ['ContactUs'],

  endpoints: (builder) => ({
    // Get all contact us messages with optional search and pagination
    getContactUsMessages: builder.query({
      query: (searchParams = {}) => {
        const params = new URLSearchParams();
        if (searchParams.name) {
          params.append("name", searchParams.name);
        }
        if (searchParams.email) {
          params.append("email", searchParams.email);
        }
        if (searchParams.subject) {
          params.append("subject", searchParams.subject);
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
          url: `/contact-us${queryString ? `?${queryString}` : ""}`,
        };
      },
      transformResponse: (response) => {
        // Return the full response to access both data and pagination
        return response;
      },
      providesTags: ['ContactUs'],
    }),

    // Get a single contact us message by ID
    getContactUsMessage: builder.query({
      query: (id) => createRequest(`/contact-us/${id}`),
      providesTags: (result, error, id) => [{ type: 'ContactUs', id }],
    }),

    // Update contact us message status
    updateContactUsStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/contact-us/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'ContactUs', id }, 'ContactUs'],
    }),

    // Delete contact us message
    deleteContactUsMessage: builder.mutation({
      query: (id) => ({
        url: `/contact-us/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['ContactUs'],
    }),

    // Reply to contact us message
    replyToContactUs: builder.mutation({
      query: ({ id, reply }) => ({
        url: `/contact-us/${id}/reply`,
        method: "POST",
        body: { reply },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'ContactUs', id }, 'ContactUs'],
    }),
  }),
});

export const {
  useGetContactUsMessagesQuery,
  useGetContactUsMessageQuery,
  useUpdateContactUsStatusMutation,
  useDeleteContactUsMessageMutation,
  useReplyToContactUsMutation,
} = contactUsApiService;

export { refreshToken, isTokenExpired };
