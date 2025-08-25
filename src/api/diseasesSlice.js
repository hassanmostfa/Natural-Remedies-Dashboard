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

export const diseasesApiService = createApi({
  reducerPath: "diseasesApiService",
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
    // Get all diseases with optional search
    getDiseases: builder.query({
      query: (searchParams = {}) => {
        const params = new URLSearchParams();
        if (searchParams.name) {
          params.append("name", searchParams.name);
        }
        if (searchParams.page) {
          params.append("page", String(searchParams.page));
        }
        if (searchParams.per_page) {
          params.append("per_page", String(searchParams.per_page));
        }
        const queryString = params.toString();
        return {
          url: `/diseases${queryString ? `?${queryString}` : ""}`,
        };
      },
      transformResponse: (response) => {
        // Return the full response to access both data and pagination
        return response;
      },
    }),

    // Get a single disease by ID
    getDisease: builder.query({
      query: (id) => createRequest(`/diseases/${id}`),
    }),

    // Create disease
    createDisease: builder.mutation({
      query: (disease) => ({
        url: "/diseases",
        method: "POST",
        body: disease,
      }),
    }),

    // Update disease
    updateDisease: builder.mutation({
      query: ({ id, disease }) => ({
        url: `/diseases/${id}`,
        method: "PUT",
        body: disease,
      }),
    }),

    // Delete disease
    deleteDisease: builder.mutation({
      query: (id) => ({
        url: `/diseases/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetDiseasesQuery,
  useGetDiseaseQuery,
  useCreateDiseaseMutation,
  useUpdateDiseaseMutation,
  useDeleteDiseaseMutation,
} = diseasesApiService;

export { refreshToken, isTokenExpired };
