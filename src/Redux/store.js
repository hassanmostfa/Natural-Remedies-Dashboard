import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { adminApiService } from "api/adminSlice";
import { bodySystemsApiService } from "api/bodySystemsSlice";
import { remedyTypesApiService } from "api/remediesTypesSlice";
import { remediesApiService } from "api/remediesSlice";
import { diseasesApiService } from "api/diseasesSlice";
import { fileUploadApiService } from "api/fileUploadSlice";
import { videosApiService } from "api/videosSlice";
import { articlesApiService } from "api/articlesSlice";
import { reviewsApiService } from "api/reviewsSlice";
import { usersApiService } from "api/usersSlice";
import { adsApiService } from "api/adsSlice"; 
import { faqsApiService } from "api/faqsSlice";
import { policiesApiService } from "api/policiesSlice";
import { contactUsApiService } from "api/contactUsSlice";
import { aboutApiService } from "api/aboutSlice";
import { instructorsApiService } from "api/instructorsSlice";
import { coursesApiService } from "api/coursesSlice";
import { lessonsApiService } from "api/lessonsSlice";
import { notificationsApi } from "api/notificationsSlice";
import { feedbackApi } from "api/feedbackSlice";
import { subscriptionsApi } from "api/subscriptionsSlice";
import { staticsApi } from "api/staticsSlice";
// import { userApi, authReducer } from './userSlice';

export const store = configureStore({
  reducer: {
    [adminApiService.reducerPath]: adminApiService.reducer,
    [bodySystemsApiService.reducerPath]: bodySystemsApiService.reducer,
    [remedyTypesApiService.reducerPath]: remedyTypesApiService.reducer,
    [remediesApiService.reducerPath]: remediesApiService.reducer,
    [diseasesApiService.reducerPath]: diseasesApiService.reducer,
    [fileUploadApiService.reducerPath]: fileUploadApiService.reducer,
    [videosApiService.reducerPath]: videosApiService.reducer,
    [articlesApiService.reducerPath]: articlesApiService.reducer,
    [reviewsApiService.reducerPath]: reviewsApiService.reducer,
    [usersApiService.reducerPath]: usersApiService.reducer,
    [adsApiService.reducerPath]: adsApiService.reducer,
    [faqsApiService.reducerPath]: faqsApiService.reducer,
    [policiesApiService.reducerPath]: policiesApiService.reducer,
    [contactUsApiService.reducerPath]: contactUsApiService.reducer,
    [aboutApiService.reducerPath]: aboutApiService.reducer,
    [instructorsApiService.reducerPath]: instructorsApiService.reducer,
    [coursesApiService.reducerPath]: coursesApiService.reducer,
    [lessonsApiService.reducerPath]: lessonsApiService.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [feedbackApi.reducerPath]: feedbackApi.reducer,
    [subscriptionsApi.reducerPath]: subscriptionsApi.reducer,
    [staticsApi.reducerPath]: staticsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      adminApiService.middleware,
      bodySystemsApiService.middleware,
      remedyTypesApiService.middleware,
      remediesApiService.middleware,
      diseasesApiService.middleware,
      fileUploadApiService.middleware,
      videosApiService.middleware,
      articlesApiService.middleware,
      reviewsApiService.middleware,
      usersApiService.middleware,
      adsApiService.middleware,
      faqsApiService.middleware,
      policiesApiService.middleware,
      contactUsApiService.middleware,
      aboutApiService.middleware,
      instructorsApiService.middleware,
      coursesApiService.middleware,
      lessonsApiService.middleware,
      notificationsApi.middleware,
      feedbackApi.middleware,
      subscriptionsApi.middleware,
      staticsApi.middleware,
    ),
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// See `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
