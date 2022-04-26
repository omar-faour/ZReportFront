import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";




export const login = createAsyncThunk(
  "auth/login",
  async (params, { getState }) => {
    const options = {
      method: 'POST',
      url: '/api/auth/signin',
      params: {...params, username: params?.username?.toLowerCase(), password: params?.password},
      
    };
    const result = await axios.request(options)
    return result.data;
  }
);