import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseUrl = 'https://xealkhalej-backend.alwajez.com/api/user';
// Define the API slice
export const servicesApi = createApi({
  reducerPath: 'servicesApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => '/services',
    }),
    getServiceById: builder.query({
      query: (id) => `/show-service/${id}`,
    }),
    
    createService: builder.mutation({
      query: (newService) => ({
        url: '/add-service',
        method: 'POST',
        body: newService,
      }),
    }),
    updateService: builder.mutation({

      query: ({ id, updatedService }) => ({
        url: `/update-service/${id}`,
        method: 'POST',
        body: updatedService,
      }),
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/delete-service/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// Export hooks for the services
export const {
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetServiceByIdQuery,
} = servicesApi;

export default servicesApi;
