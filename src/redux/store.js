import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import authReducer from "./reducers/auth/authSlice";
import storeReducer from "./reducers/store/storeSlice";
import dataReducer from "./reducers/data/dataSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  storage
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const reducers = combineReducers({
  auth: persistedAuthReducer,
  store: storeReducer,
  data: dataReducer
});


const store = configureStore({
  reducer: reducers,
  middleware: [thunk]
});

export default store;