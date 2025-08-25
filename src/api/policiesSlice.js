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

export const policiesApiService = createApi({
  reducerPath: "policiesApiService",
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

  tagTypes: ['Policy'],

  endpoints: (builder) => ({
    // Get all policies with optional search and pagination
    getPolicies: builder.query({
      query: (searchParams = {}) => {
        const params = new URLSearchParams();
        if (searchParams.title) {
          params.append("title", searchParams.title);
        }
        // Always include type parameter - default to 'terms' if not specified
        const type = searchParams.type || 'terms';
        params.append("type", type);
        if (searchParams.page) {
          params.append("page", String(searchParams.page));
        }
        if (searchParams.per_page) {
          params.append("per_page", String(searchParams.per_page));
        }
        const queryString = params.toString();
        return {
          url: `/policies?${queryString}`,
        };
      },
      transformResponse: (response) => {
        // Return the full response to access both data and pagination
        return response;
      },
      providesTags: ['Policy'],
    }),

    // Get a single policy by ID
    getPolicy: builder.query({
      query: (id) => createRequest(`/policies/${id}`),
      providesTags: (result, error, id) => [{ type: 'Policy', id }],
    }),

    // Create policy
    createPolicy: builder.mutation({
      query: (policy) => ({
        url: "/policies",
        method: "POST",
        body: policy,
      }),
      invalidatesTags: ['Policy'],
    }),

    // Update policy
    updatePolicy: builder.mutation({
      query: ({ id, policy }) => ({
        url: `/policies/${id}`,
        method: "PUT",
        body: policy,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Policy', id }, 'Policy'],
    }),

    // Delete policy
    deletePolicy: builder.mutation({
      query: (id) => ({
        url: `/policies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Policy'],
    }),
  }),
});

export const {
  useGetPoliciesQuery,
  useGetPolicyQuery,
  useCreatePolicyMutation,
  useUpdatePolicyMutation,
  useDeletePolicyMutation,
} = policiesApiService;

export { refreshToken, isTokenExpired };
