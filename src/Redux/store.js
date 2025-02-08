import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { SliderApi } from "api/SliderSlice";

// import { userApi, authReducer } from './userSlice';

export const store = configureStore({
  reducer: {
     [SliderApi.reducerPath]: SliderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      SliderApi.middleware
    ),
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// See `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
