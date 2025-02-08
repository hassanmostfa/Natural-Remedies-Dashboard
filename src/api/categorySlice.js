import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseUrl = 'https://ghali-group-backend.mediagrafico.com/api';
// Define the API slice
export const categorySlice = createApi({
  reducerPath: 'categorySlice',
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
    getCategories: builder.query({
      query: () => '/categories',
    }),
    getCategoryById: builder.query({
      query: (id) => `/categories/${id}`,
    }),
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: '/add-category',
        method: 'POST',
        body: newCategory,
      }),
    }),
    updateCategory: builder.mutation({
      query: ({ slug, updatedCategory }) => ({
        url: `/update-category/${slug}`,
        method: 'POST',
        body: updatedCategory,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (slug) => ({
        url: `/delete-category/${slug}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// Export hooks for the services
export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryByIdQuery,
} = categorySlice;

export default categorySlice;
