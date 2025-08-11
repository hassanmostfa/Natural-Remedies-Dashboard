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

export const coursesApiService = createApi({
  reducerPath: "coursesApiService",
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
    // Get all courses with optional search and pagination
    getCourses: builder.query({
      query: (searchParams = {}) => {
        const params = new URLSearchParams();
        if (searchParams.title) {
          params.append("title", searchParams.title);
        }
        if (searchParams.instructor_id) {
          params.append("instructor_id", searchParams.instructor_id);
        }
        if (searchParams.category) {
          params.append("category", searchParams.category);
        }
        if (searchParams.status) {
          params.append("status", searchParams.status);
        }
        if (searchParams.difficulty) {
          params.append("difficulty", searchParams.difficulty);
        }
        if (searchParams.page) {
          params.append("page", String(searchParams.page));
        }
        if (searchParams.per_page) {
          params.append("per_page", String(searchParams.per_page));
        }
        const queryString = params.toString();
        return {
          url: `/courses${queryString ? `?${queryString}` : ""}`,
        };
      },
      transformResponse: (response) => {
        // Return the full response to access both data and pagination
        return response;
      },
    }),

    // Get a single course by ID
    getCourse: builder.query({
      query: (id) => createRequest(`/courses/${id}`),
    }),

    // Create course
    createCourse: builder.mutation({
      query: (course) => ({
        url: "/courses",
        method: "POST",
        body: course,
      }),
    }),

    // Update course
    updateCourse: builder.mutation({
      query: ({ id, course }) => ({
        url: `/courses/${id}`,
        method: "PUT",
        body: course,
      }),
    }),

    // Delete course
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
    }),

    // Update course status (active/inactive)
    updateCourseStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/courses/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
    }),

    // Get course statistics
    getCourseStats: builder.query({
      query: () => createRequest("/courses/stats"),
    }),

    // Get courses by category
    getCoursesByCategory: builder.query({
      query: (category) => ({
        url: `/courses/category/${category}`,
      }),
    }),

    // Get courses by instructor
    getCoursesByInstructor: builder.query({
      query: (instructorId) => ({
        url: `/courses/instructor/${instructorId}`,
      }),
    }),

    // Get courses by difficulty level
    getCoursesByDifficulty: builder.query({
      query: (difficulty) => ({
        url: `/courses/difficulty/${difficulty}`,
      }),
    }),

    // Bulk operations
    bulkUpdateCourses: builder.mutation({
      query: ({ ids, updates }) => ({
        url: "/courses/bulk-update",
        method: "PATCH",
        body: { ids, updates },
      }),
    }),

    bulkDeleteCourses: builder.mutation({
      query: ({ ids }) => ({
        url: "/courses/bulk-delete",
        method: "DELETE",
        body: { ids },
      }),
    }),

    // Export courses
    exportCourses: builder.query({
      query: (format = 'csv') => ({
        url: `/courses/export?format=${format}`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Import courses
    importCourses: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: "/courses/import",
          method: "POST",
          body: formData,
        };
      },
    }),

    // Course enrollment management
    getCourseEnrollments: builder.query({
      query: (courseId) => createRequest(`/courses/${courseId}/enrollments`),
    }),

    // Course content management
    getCourseContent: builder.query({
      query: (courseId) => createRequest(`/courses/${courseId}/content`),
    }),

    // Course reviews
    getCourseReviews: builder.query({
      query: (courseId) => createRequest(`/courses/${courseId}/reviews`),
    }),

    // Course progress tracking
    getCourseProgress: builder.query({
      query: (courseId) => createRequest(`/courses/${courseId}/progress`),
    }),

    // Featured courses
    getFeaturedCourses: builder.query({
      query: () => createRequest("/courses/featured"),
    }),

    // Popular courses
    getPopularCourses: builder.query({
      query: () => createRequest("/courses/popular"),
    }),

    // Latest courses
    getLatestCourses: builder.query({
      query: () => createRequest("/courses/latest"),
    }),

    // Search courses
    searchCourses: builder.query({
      query: (searchTerm) => ({
        url: `/courses/search?q=${encodeURIComponent(searchTerm)}`,
      }),
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useUpdateCourseStatusMutation,
  useGetCourseStatsQuery,
  useGetCoursesByCategoryQuery,
  useGetCoursesByInstructorQuery,
  useGetCoursesByDifficultyQuery,
  useBulkUpdateCoursesMutation,
  useBulkDeleteCoursesMutation,
  useExportCoursesQuery,
  useImportCoursesMutation,
  useGetCourseEnrollmentsQuery,
  useGetCourseContentQuery,
  useGetCourseReviewsQuery,
  useGetCourseProgressQuery,
  useGetFeaturedCoursesQuery,
  useGetPopularCoursesQuery,
  useGetLatestCoursesQuery,
  useSearchCoursesQuery,
} = coursesApiService;

export { refreshToken, isTokenExpired };
