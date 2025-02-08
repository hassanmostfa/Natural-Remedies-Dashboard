import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseUrl = 'https://ghali-group-backend.mediagrafico.com/api';
// Define the API slice
export const LinkSlice = createApi({
  reducerPath: 'LinkSlice',
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
    getLinksByCategory: builder.query({
      query: (category) => `/links?category=${category}`,
    }),

    createLink: builder.mutation({
      query: (newLink) => ({
        url: '/add-link',
        method: 'POST',
        body: newLink,
      }),
    }),
  }),
});

// Export hooks for the services
export const {
  useGetLinksByCategoryQuery,
  useCreateLinkMutation,
} = LinkSlice;

export default LinkSlice;
