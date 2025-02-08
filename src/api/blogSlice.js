import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseUrl = 'https://ghali-group-backend.mediagrafico.com/api';
// Define the API slice
export const blogApi = createApi({
  reducerPath: 'blogApi',
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
    getBlogs: builder.query({
      query: () => '/blogs',
    }),
    getBlogById: builder.query({
      query: (slug) => `/blog/${slug}`,
    }),
    
    createBlog: builder.mutation({
      query: (newBlog) => ({
        url: '/add-blog',
        method: 'POST',
        body: newBlog,
      }),
    }),
    updateBlog: builder.mutation({
      query: ({ slug, updatedBlog }) => ({
        url: `/update-blog/${slug}`,
        method: 'POST',
        body: updatedBlog,
      }),
    }),
    deleteBlog: builder.mutation({
      query: (slug) => ({
        url: `/delete-blog/${slug}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// Export hooks for the services
export const {
  useGetBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetBlogByIdQuery,
} = blogApi;

export default blogApi;
