import { configureStore } from '@reduxjs/toolkit'
import { youtubeSlice } from '@/features/Youtube/youtubeSlice'

export const store = configureStore({
  reducer: {
    youtube: youtubeSlice.reducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
