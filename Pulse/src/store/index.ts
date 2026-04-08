import { configureStore } from '@reduxjs/toolkit';
import feedReducer from '../slices/feedSlice';
import savedReducer from '../slices/savedSlice';
import uiReducer from '../slices/uiSlice';

export const store = configureStore({
  reducer: {
    feed: feedReducer,
    saved: savedReducer,
    ui: uiReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
