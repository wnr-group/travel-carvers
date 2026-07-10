import { configureStore, createSlice } from '@reduxjs/toolkit'

// Placeholder slice - remove this when you add real slices
const placeholderSlice = createSlice({
  name: 'placeholder',
  initialState: {},
  reducers: {},
})

export const makeStore = () => {
  return configureStore({
    reducer: {
      placeholder: placeholderSlice.reducer,
      // Add your real reducers here as needed
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
