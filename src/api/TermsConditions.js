import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "https://ghali-group-backend.mediagrafico.com/api";

export const ConditionsApi = createApi({
  reducerPath: "conditionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // Add Authorization token if needed
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Fetch all faqs (GET)
    getConditions: builder.query({
      query: (type) => "/conditions?type=" + type,
    }),

    // Create a new faq (POST)
    createCondition: builder.mutation({
      query: (newFaq) => ({
        url: "/add-condition",
        method: "POST",
        body: newFaq,
      }),
    }),

    // Update an existing faq (PUT)
    updateCondtion: builder.mutation({
      query: ({ id, updatedCondition }) => ({
        url: `/update-condition/${id}`,
        method: "POST",
        body: updatedCondition,
      }),
    }),

    // Delete a faq (DELETE)
    deleteCondtion: builder.mutation({
      query: (id) => ({
        url: `/delete-condition/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export the hooks generated for the endpoints
export const {
  useGetConditionsQuery,
  useGetFaqByIdQuery,
  useCreateConditionMutation,
  useUpdateCondtionMutation,
  useDeleteCondtionMutation,
} = ConditionsApi;
