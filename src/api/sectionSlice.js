import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseUrl = 'https://ghali-group-backend.mediagrafico.com/api';
// Define the API slice
export const sectionSlice = createApi({
  reducerPath: 'sectionSlice',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        headers.set('Accept','application/json')
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSections: builder.query({
      query: (type) => `/sections-by-type?type=${type}`,
    }),
    getSectionByCategory: builder.query({
      query: (category) => `/category-sections/${category}`,
    }),
    getSectionById: builder.query({
      query: (id) => `/section/${id}`,
    }),
    createSection: builder.mutation({
      query: (newSection) => ({
        url: '/sections',
        method: 'POST',
        body: newSection,
      }),
    }),
    updateSection: builder.mutation({
      query: ({ id, updatedSection }) => ({
        url: `/sections/${id}`,
        method: 'POST',
        body: updatedSection,
      }),
    }),
    deleteSection: builder.mutation({
      query: (id) => ({
        url: `/sections/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// Export hooks for the services
export const {
  useGetSectionsQuery,
  useGetSectionByCategoryQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useGetSectionByIdQuery,
} = sectionSlice;

export default sectionSlice;
