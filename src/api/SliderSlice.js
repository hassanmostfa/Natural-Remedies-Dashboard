import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "https://ghali-group-backend.mediagrafico.com/api";

export const SliderApi = createApi({
  reducerPath: "sliderApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // Add Authorization token if needed
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Fetch all faqs (GET)
    getSlider: builder.query({
      query: () => "/sliders",
    }),

    // Create a new faq (POST)
    createSlider: builder.mutation({
      query: (newSlide) => ({
        url: "/add-slider",
        method: "POST",
        body: newSlide,
      }),
    }),

    // Update an existing faq (PUT)
    updateSlider: builder.mutation({
      query: ({ id, updatedSlider }) => ({
        url: `/update-slider/${id}`,
        method: "POST",
        body: updatedSlider,
      }),
    }),

    // Delete a faq (DELETE)
    deleteSlider: builder.mutation({
      query: (id) => ({
        url: `/delete-slider/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export the hooks generated for the endpoints
export const {
  useGetSliderQuery,
  useCreateSliderMutation,
  useUpdateSliderMutation,
  useDeleteSliderMutation,
} = SliderApi;
