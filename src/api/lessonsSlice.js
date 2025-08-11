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

export const lessonsApiService = createApi({
  reducerPath: "lessonsApiService",
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
  tagTypes: ['Lesson', 'LessonsList'],

  endpoints: (builder) => ({
    // Get all lessons with optional search, pagination and course filter
    getLessons: builder.query({
      query: (searchParams = {}) => {
        const params = new URLSearchParams();
        if (searchParams.title) {
          params.append("title", searchParams.title);
        }
        if (searchParams.course_id) {
          params.append("course_id", searchParams.course_id);
        }
        if (searchParams.instructor_id) {
          params.append("instructor_id", searchParams.instructor_id);
        }
        if (searchParams.type) {
          params.append("type", searchParams.type);
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
        if (searchParams.search) {
          params.append("search", searchParams.search);
        }
        const queryString = params.toString();
        return {
          url: `/lessons${queryString ? `?${queryString}` : ""}`,
        };
      },
      providesTags: (result, error, arg) => [
        'LessonsList',
        ...(result?.data ? result.data.map(({ id }) => ({ type: 'Lesson', id })) : [])
      ],
      transformResponse: (response) => {
        return response;
      },
    }),

    // Get lessons by course ID
    getLessonsByCourse: builder.query({
      query: ({ courseId, ...searchParams }) => {
        const params = new URLSearchParams();
        params.append("course_id", String(courseId));
        if (searchParams.page) {
          params.append("page", String(searchParams.page));
        }
        if (searchParams.per_page) {
          params.append("per_page", String(searchParams.per_page));
        }
        if (searchParams.search) {
          params.append("search", searchParams.search);
        }
        const queryString = params.toString();
        return {
          url: `/lessons?${queryString}`,
        };
      },
      providesTags: (result, error, arg) => [
        'LessonsList',
        ...(result?.data ? result.data.map(({ id }) => ({ type: 'Lesson', id })) : [])
      ],
    }),

    // Get a single lesson by ID
    getLesson: builder.query({
      query: (id) => createRequest(`/lessons/${id}`),
      providesTags: (result, error, id) => [{ type: 'Lesson', id }],
    }),

    // Create lesson
    createLesson: builder.mutation({
      query: (lesson) => ({
        url: "/lessons",
        method: "POST",
        body: lesson,
      }),
      invalidatesTags: ['LessonsList'],
    }),

    // Update lesson
    updateLesson: builder.mutation({
      query: ({ id, lesson }) => ({
        url: `/lessons/${id}`,
        method: "PUT",
        body: lesson,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Lesson', id },
        'LessonsList'
      ],
    }),

    // Delete lesson
    deleteLesson: builder.mutation({
      query: (id) => ({
        url: `/lessons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Lesson', id },
        'LessonsList'
      ],
    }),

  // Publish/Unpublish lesson
    toggleLessonPublish: builder.mutation({
      query: ({ id, published }) => ({
        url: `/lessons/${id}/publish`,
        method: "PATCH",
        body: { published },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Lesson', id },
        'LessonsList'
      ],
    }),
  }),
});

export const {
  useGetLessonsQuery,
  useGetLessonsByCourseQuery,
  useGetLessonQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,

} = lessonsApiService;

export { refreshToken, isTokenExpired };
