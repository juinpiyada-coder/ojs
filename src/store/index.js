import { configureStore } from '@reduxjs/toolkit';
import { ojsApi } from './apiSlice';

export const store = configureStore({
  reducer: {
    [ojsApi.reducerPath]: ojsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ojsApi.middleware),
});

export default store;
