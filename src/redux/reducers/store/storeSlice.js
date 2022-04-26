import { createSlice } from '@reduxjs/toolkit';


export const storeSlice = createSlice({
  name: 'store',
  initialState: {
    selectedStore: null
  },
  reducers: {
    selectStore: (state, action) => {
      console.log("SELECT STORE: ", action.payload)
      return {
          selectedStore: action.payload,
        }
      }
    },

})

// Action creators are generated for each case reducer function
export const { selectStore } = storeSlice.actions

export default storeSlice.reducer