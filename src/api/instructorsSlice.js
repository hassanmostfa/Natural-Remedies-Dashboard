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

export const instructorsApiService = createApi({
  reducerPath: "instructorsApiService",
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
    // Get all instructors with optional search and pagination
    getInstructors: builder.query({
      query: (searchParams = {}) => {
        const params = new URLSearchParams();
        if (searchParams.name) {
          params.append("name", searchParams.name);
        }
        if (searchParams.email) {
          params.append("email", searchParams.email);
        }
        if (searchParams.specialization) {
          params.append("specialization", searchParams.specialization);
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
          url: `/instructors${queryString ? `?${queryString}` : ""}`,
        };
      },
      transformResponse: (response) => {
        // Return the full response to access both data and pagination
        return response;
      },
    }),

    // Get a single instructor by ID
    getInstructor: builder.query({
      query: (id) => createRequest(`/instructors/${id}`),
    }),

    // Create instructor
    createInstructor: builder.mutation({
      query: (instructor) => ({
        url: "/instructors",
        method: "POST",
        body: instructor,
      }),
    }),

    // Update instructor
    updateInstructor: builder.mutation({
      query: ({ id, instructor }) => ({
        url: `/instructors/${id}`,
        method: "PUT",
        body: instructor,
      }),
    }),

    // Delete instructor
    deleteInstructor: builder.mutation({
      query: (id) => ({
        url: `/instructors/${id}`,
        method: "DELETE",
      }),
    }),

    // Update instructor status (activate/deactivate)
    updateInstructorStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/instructors/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
    }),

    // Get instructor statistics
    getInstructorStats: builder.query({
      query: () => createRequest("/instructors/stats"),
    }),

    // Get instructors by specialization
    getInstructorsBySpecialization: builder.query({
      query: (specialization) => ({
        url: `/instructors/specialization/${specialization}`,
      }),
    }),

    // Bulk operations
    bulkUpdateInstructors: builder.mutation({
      query: ({ ids, updates }) => ({
        url: "/instructors/bulk-update",
        method: "PATCH",
        body: { ids, updates },
      }),
    }),

    bulkDeleteInstructors: builder.mutation({
      query: ({ ids }) => ({
        url: "/instructors/bulk-delete",
        method: "DELETE",
        body: { ids },
      }),
    }),

    // Export instructors
    exportInstructors: builder.query({
      query: (format = 'csv') => ({
        url: `/instructors/export?format=${format}`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Import instructors
    importInstructors: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: "/instructors/import",
          method: "POST",
          body: formData,
        };
      },
    }),

    // Get instructor courses
    getInstructorCourses: builder.query({
      query: (id) => createRequest(`/instructors/${id}/courses`),
    }),

    // Get instructor reviews
    getInstructorReviews: builder.query({
      query: (id) => createRequest(`/instructors/${id}/reviews`),
    }),
  }),
});

export const {
  useGetInstructorsQuery,
  useGetInstructorQuery,
  useCreateInstructorMutation,
  useUpdateInstructorMutation,
  useDeleteInstructorMutation,
  useUpdateInstructorStatusMutation,
  useGetInstructorStatsQuery,
  useGetInstructorsBySpecializationQuery,
  useBulkUpdateInstructorsMutation,
  useBulkDeleteInstructorsMutation,
  useExportInstructorsQuery,
  useImportInstructorsMutation,
  useGetInstructorCoursesQuery,
  useGetInstructorReviewsQuery,
} = instructorsApiService;

export { refreshToken, isTokenExpired };
