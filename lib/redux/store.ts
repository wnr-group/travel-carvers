import { configureStore, createSlice } from '@reduxjs/toolkit'

// Placeholder slice - remove this when you add real slices
const placeholderSlice = createSlice({
  name: 'placeholder',
  initialState: {},
  reducers: {},
})

export const store = configureStore({
  reducer: {
    placeholder: placeholderSlice.reducer,
    // Add your real reducers here as needed
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
