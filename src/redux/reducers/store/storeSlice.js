import { createSlice } from '@reduxjs/toolkit';


export const storeSlice = createSlice({
  name: 'store',
  initialState: {
    store: null,
    selectedStore: null
  },
  reducers: {
    setStore: (state, action) => {
      return {
        ...state,
          store: action.payload,
        }
      },
      setSelectedStore: (state, action)=>{
        return {
          ...state,
          selectedStore: action.payload
        }
      }
    },
    

})

// Action creators are generated for each case reducer function
export const { setStore, setSelectedStore } = storeSlice.actions

export default storeSlice.reducer