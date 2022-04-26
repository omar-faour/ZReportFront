import { createSlice } from '@reduxjs/toolkit';


export const dataSlice = createSlice({
  name: 'data',
  initialState: {
      zheaderId: null,
      selectedDate: null
  },
  reducers: {
    setZHeaderId: (state, action) => {
        return {
            ...state,
            zheaderId: action.payload,
        }
    },
    setSelectedDate: (state, action)=>{
        return {
            ...state,
            selectedDate: action.payload
        }
    }
}
    

})

// Action creators are generated for each case reducer function
export const { setZHeaderId,  setSelectedDate} = dataSlice.actions

export default dataSlice.reducer