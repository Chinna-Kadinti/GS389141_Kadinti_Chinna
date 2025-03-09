import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import storeReducer from './slices/storeSlice';
import skuReducer from './slices/skuSlice';
import planningReducer from './slices/planningSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stores: storeReducer,
    skus: skuReducer,
    planning: planningReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;