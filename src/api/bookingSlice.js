import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the base URL of your Laravel API
const baseUrl = "https://xealkhalej-backend.alwajez.com/api/user";

export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Get all bookings
    getBookings: builder.query({
      query: () => "/bookings",
    }),
    // Get a booking by ID
    getBookingById: builder.query({
      query: (id) => `/show-booking/${id}`,
    }),
    // Create a new booking
    createBooking: builder.mutation({
      query: (newBooking) => ({
        url: "/add-booking",
        method: "POST",
        body: newBooking,
      }),
    }),
    // Update a booking
    updateBooking: builder.mutation({
      query: ({ id, ...updatedBooking }) => ({
        url: `/update-booking/${id}`,
        method: "PUT",
        body: updatedBooking,
      }),
    }),
    // Delete a booking
    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `/delete-booking/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
} = bookingsApi;
