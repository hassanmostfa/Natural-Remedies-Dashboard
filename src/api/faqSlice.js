import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'https://ghali-group-backend.mediagrafico.com/api' ;


export const faqApi = createApi({
    reducerPath: 'faqApi',
    baseQuery: fetchBaseQuery({
      baseUrl,
      prepareHeaders: (headers) => {
        // Add Authorization token if needed
        const token = localStorage.getItem('token');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
      },
    }),
    endpoints: (builder) => ({
        // Fetch all faqs (GET)
        getFaqs: builder.query({
          query: () => '/faqs',
        }),
        
        // Get a single faq by ID (GET)
        getFaqById: builder.query({
          query: (id) => `/show-faq/${id}`,
        }),
        
        // Create a new faq (POST)
        createFaq: builder.mutation({
          query: (newFaq) => ({
            url: '/add-faq',
            method: 'POST',
            body: newFaq,
          }),
        }),
    
        // Update an existing faq (PUT)
        updateFaq: builder.mutation({
          query: ({ id,updatedFaq }) => ({
            url: `/update-faq/${id}`,
            method: 'PUT',
            body: updatedFaq,
          }),
        }),
    
        // Delete a faq (DELETE)
        deleteFaq: builder.mutation({
          query: (id) => ({
            url: `/delete-faq/${id}`,
            method: 'DELETE',
          }),
        }),
      }),
});

// Export the hooks generated for the endpoints
export const {
    useGetFaqsQuery,
    useGetFaqByIdQuery,
    useCreateFaqMutation,
    useUpdateFaqMutation,
    useDeleteFaqMutation,
  } = faqApi;
  