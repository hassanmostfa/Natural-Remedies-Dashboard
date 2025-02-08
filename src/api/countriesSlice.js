import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base URL of your Laravel API
const baseUrl = 'https://xealkhalej-backend.alwajez.com/api/user';

// Create the API slice for countries
export const countriesApi = createApi({
  reducerPath: 'countriesApi',
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
    // Fetch all countries (GET)
    getCountries: builder.query({
      query: () => '/countries',
    }),
    
    // Get a single country by ID (GET)
    getCountryById: builder.query({
      query: (id) => `/show-country/${id}`,
    }),
    
    // Create a new country (POST)
    createCountry: builder.mutation({
      query: (newCountry) => ({
        url: '/add-country',
        method: 'POST',
        body: newCountry,
      }),
    }),

    // Update an existing country (PUT)
    updateCountry: builder.mutation({
      query: ({ id,updatedCountry }) => ({
        url: `/update-country/${id}`,
        method: 'POST',
        body: updatedCountry,
      }),
    }),

    // Delete a country (DELETE)
    deleteCountry: builder.mutation({
      query: (id) => ({
        url: `/delete-country/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// Export the hooks generated for the endpoints
export const {
  useGetCountriesQuery,
  useGetCountryByIdQuery,
  useCreateCountryMutation,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
} = countriesApi;
